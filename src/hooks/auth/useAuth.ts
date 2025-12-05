/**
 * useAuth Hook
 * Manages authentication state and provides auth-related functions
 */

import { useState, useCallback } from 'react';
import { authService } from '@/lib/api/auth/authService';
import { authStorage } from '@/lib/storage/authStorage';
import type { ApiError } from '@/lib/api/client';
import type { CustomerDto, CustomerCreationDto } from '@/lib/api/auth/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: CustomerDto | null;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: !!authStorage.getToken(),
    isLoading: false,
    user: (authStorage.getUser() as CustomerDto) || null,
    error: null,
  });

  /**
   * Set loading state
   */
  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  /**
   * Set error state
   */
  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  /**
   * Request OTP for login
   */
  const requestOtp = useCallback(
    async (phoneNumber: string): Promise<string> => {
      setLoading(true);
      setError(null);

      try {
        // Store phone number for OTP page
        authStorage.setPendingPhone(phoneNumber);

        const response = await authService.requestOtp({ phoneNumber });

        // Console log OTP for testing (as requested)
        console.log('OTP Code:', response.otp);

        return response.otp;
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError.errorCode === 'entity-not-found'
            ? 'User not found. Please register first.'
            : apiError.errorMessage || 'Failed to request OTP';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  /**
   * Verify OTP and get auth token
   */
  const verifyOtpAndLogin = useCallback(
    async (phoneNumber: string, otp: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        // Verify OTP
        await authService.verifyOtp({ phoneNumber, otp });

        // Get auth token
        const authResponse = await authService.getAuthToken({ phoneNumber });

        // Store token
        authStorage.setToken(authResponse.token);

        // Get user details by phone number
        const customers = await authService.getCustomerByPhone(phoneNumber);
        if (customers.length > 0) {
          const user = customers[0];
          authStorage.setUser(user);
          setState((prev) => ({
            ...prev,
            isAuthenticated: true,
            user,
          }));
        }

        // Clear pending phone
        authStorage.removePendingPhone();
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError.errorCode === 'invalid-otp'
            ? 'Incorrect OTP Code'
            : apiError.errorMessage || 'Failed to verify OTP';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  /**
   * Register new user
   */
  const register = useCallback(
    async (data: CustomerCreationDto): Promise<CustomerDto> => {
      setLoading(true);
      setError(null);

      try {
        const customer = await authService.register(data);

        // Store phone number for OTP flow
        if (customer.phoneNumber) {
          authStorage.setPendingPhone(customer.phoneNumber);
        }

        return customer;
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError.errorCode === 'resource-already-exists'
            ? 'User already exists. Please login.'
            : apiError.errorMessage || 'Registration failed';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  /**
   * Logout
   */
  const logout = useCallback(() => {
    authStorage.clearAll();
    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
    });
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    // State
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    user: state.user,
    error: state.error,

    // Functions
    requestOtp,
    verifyOtpAndLogin,
    register,
    logout,
    clearError,
  };
}

