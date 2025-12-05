/**
 * useAuth Hook
 * Manages authentication state and provides auth-related functions
 */

import { useState, useCallback, useEffect } from 'react';
import { authService } from '@/lib/api/auth/authService';
import { authStorage } from '@/lib/storage/authStorage';
import { decodeJwt, isTokenExpired, getUserIdFromToken } from '@/lib/utils/jwt';
import type { ApiError } from '@/lib/api/client';
import type { CustomerDto, CustomerCreationDto } from '@/lib/api/auth/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: CustomerDto | null;
  error: string | null;
}

export function useAuth() {
  // Initialize state and validate token on mount
  const [state, setState] = useState<AuthState>(() => {
    const token = authStorage.getToken();
    const isValid = token && !isTokenExpired(token);
    
    return {
      isAuthenticated: !!isValid,
      isLoading: false,
      user: isValid ? (authStorage.getUser() as CustomerDto) || null : null,
      error: null,
    };
  });

  // Validate token and refresh user data on mount
  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      setState((prev) => ({ ...prev, isAuthenticated: false, user: null }));
      return;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      authStorage.clearAll();
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      });
      return;
    }

    // If we have token but no user data, fetch it
    const storedUser = authStorage.getUser();
    if (!storedUser) {
      const phoneNumber = getUserIdFromToken(token);
      if (phoneNumber) {
        setState((prev) => ({ ...prev, isLoading: true }));
        authService
          .getCustomerByPhone(phoneNumber)
          .then((customers) => {
            if (customers.length > 0) {
              const user = customers[0];
              authStorage.setUser(user);
              setState((prev) => ({
                ...prev,
                isAuthenticated: true,
                user,
                isLoading: false,
              }));
            } else {
              setState((prev) => ({
                ...prev,
                isAuthenticated: false,
                isLoading: false,
              }));
            }
          })
          .catch(() => {
            setState((prev) => ({
              ...prev,
              isAuthenticated: false,
              isLoading: false,
            }));
          });
      }
    }
  }, []); // Only run on mount

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

        // Decode JWT to get phone number (for verification)
        const tokenPayload = decodeJwt(authResponse.token);
        const tokenPhoneNumber = tokenPayload?.sub || phoneNumber;

        // Get user details by phone number from token
        const customers = await authService.getCustomerByPhone(tokenPhoneNumber);
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
   * Validate token and refresh user data
   * Useful for checking token validity on app load or after token refresh
   */
  const validateToken = useCallback(async (): Promise<boolean> => {
    const token = authStorage.getToken();
    if (!token) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
      }));
      return false;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      authStorage.clearAll();
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
      }));
      return false;
    }

    // Get phone number from token
    const phoneNumber = getUserIdFromToken(token);
    if (!phoneNumber) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
      }));
      return false;
    }

    // Refresh user data
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const customers = await authService.getCustomerByPhone(phoneNumber);
      if (customers.length > 0) {
        const user = customers[0];
        authStorage.setUser(user);
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          user,
          isLoading: false,
        }));
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          isLoading: false,
        }));
        return false;
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: (error as ApiError).errorMessage || 'Failed to validate token',
      }));
      return false;
    }
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
    validateToken,
    clearError,
  };
}

