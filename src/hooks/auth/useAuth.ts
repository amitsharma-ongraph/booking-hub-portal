/**
 * useAuth Hook
 * Manages authentication state and provides auth-related functions
 */

import { useState, useCallback, useEffect } from 'react';
import { authService } from '@/lib/api/auth/authService';
import { companiesService } from '@/lib/api/companies/companiesService';
import { authStorage } from '@/lib/storage/authStorage';
import { decodeJwt, isTokenExpired, getUserIdFromToken } from '@/lib/utils/jwt';
import type { ApiError } from '@/lib/api/client';
import type { CustomerCreationDto } from '@/lib/api/auth/types';
import type { CompanyBasicDto } from '@/lib/api/companies/types';

// Basic company info for AuthContext (just what's needed for TopBar)
export interface BasicCompanyInfo {
  id: string;
  name: string;
  emailAddress: string;
  logo: string;
  accountNumber: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: BasicCompanyInfo | null;
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
      user: isValid ? (authStorage.getUser() as BasicCompanyInfo) || null : null,
      error: null,
    };
  });

  // Validate token and refresh user data on mount (ONLY ONCE when AuthProvider mounts)
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

    // Check if user data already exists in storage (from previous session)
    const storedUser = authStorage.getUser();
    if (storedUser) {
      // User data exists, just set it in state (no API call needed)
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: storedUser as BasicCompanyInfo,
      }));
      return;
    }

    // Only fetch if we have token but no user data in storage
    const phoneNumber = getUserIdFromToken(token);
    if (phoneNumber) {
      setState((prev) => ({ ...prev, isLoading: true }));
      // Fetch companies by phone number (service=Spa) - only get basic info
      companiesService
        .getCompaniesByPhone(phoneNumber)
        .then((companies) => {
          if (companies.length > 0) {
            // Get the first company's basic info
            const firstCompany = companies[0];
            const basicInfo: BasicCompanyInfo = {
              id: firstCompany.id,
              name: firstCompany.name,
              emailAddress: firstCompany.emailAddress,
              logo: firstCompany.logo,
              accountNumber: firstCompany.accountNumber,
            };
            authStorage.setUser(basicInfo);
            setState((prev) => ({
              ...prev,
              isAuthenticated: true,
              user: basicInfo,
              isLoading: false,
            }));
          } else {
            throw new Error('No companies found');
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
  }, []); // Only run once when AuthProvider mounts (not on page navigation)

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

        // Set authenticated state (company data will be fetched separately)
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
        }));

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
   * Register new user (company owner)
   * Uses POST /companies instead of customer API
   */
  const register = useCallback(
    async (data: CustomerCreationDto): Promise<BasicCompanyInfo> => {
      setLoading(true);
      setError(null);

      try {
        const phoneNumber = data.phoneNumber ?? '';
        const firebaseToken = data.firebaseToken ?? '';

        // Derive company name from registration fields
        const fullName = `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim();
        const companyName = fullName || data.emailAddress || phoneNumber;

        // Build POST /companies payload using only register page data
        const companyRequest: import('@/lib/api/companies/types').CreateCompanyRequestDto = {
          name: companyName,
          emailAddress: data.emailAddress,
          accountNumber: '',
          location: '',
          description: '',
          phoneNumber,
          logo: '',
          tiktokUrl: '',
          instagramUrl: '',
          whatsappNumber: phoneNumber,
          bankName: '',
          firebaseToken,
          services: [],
        };

        const company = await companiesService.createCompany(companyRequest);

        // Store phone number for OTP flow
        if (phoneNumber) {
          authStorage.setPendingPhone(phoneNumber);
        }

        // Mark that user should see onboarding on first login after registration
        authStorage.setOnboardingFlag();

        // Map created company to basic info used across the app
        const basicInfo: BasicCompanyInfo = {
          id: company.id,
          name: company.name,
          emailAddress: company.emailAddress,
          logo: company.logo,
          accountNumber: company.accountNumber,
        };

        return basicInfo;
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
   * Fetch basic company info (called after login or on app load)
   * Only fetches if user data doesn't already exist
   */
  const fetchBasicCompanyInfo = useCallback(async (): Promise<void> => {
    // Don't fetch if we already have user data
    if (state.user) {
      return;
    }

    const token = authStorage.getToken();
    if (!token || isTokenExpired(token)) {
      return;
    }

    // Check if user data already exists in storage
    const storedUser = authStorage.getUser();
    if (storedUser) {
      setState((prev) => ({
        ...prev,
        user: storedUser as BasicCompanyInfo,
      }));
      return;
    }

    const phoneNumber = getUserIdFromToken(token);
    if (!phoneNumber) {
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const companies = await companiesService.getCompaniesByPhone(phoneNumber);
      if (companies.length > 0) {
        const firstCompany = companies[0];
        const basicInfo: BasicCompanyInfo = {
          id: firstCompany.id,
          name: firstCompany.name,
          emailAddress: firstCompany.emailAddress,
          logo: firstCompany.logo,
          accountNumber: firstCompany.accountNumber,
        };
        authStorage.setUser(basicInfo);
        setState((prev) => ({
          ...prev,
          user: basicInfo,
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: (error as ApiError).errorMessage || 'Failed to fetch company info',
      }));
    }
  }, [state.user]);

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

    // Check if user data already exists (don't re-fetch if it does)
    const storedUser = authStorage.getUser();
    if (storedUser) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: storedUser as BasicCompanyInfo,
        isLoading: false,
      }));
      return true;
    }

    // Refresh basic company data (only if not in storage)
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      // Fetch companies by phone number (service=Spa) - only get basic info
      const companies = await companiesService.getCompaniesByPhone(phoneNumber);
      if (companies.length > 0) {
        // Get the first company's basic info
        const firstCompany = companies[0];
        const basicInfo: BasicCompanyInfo = {
          id: firstCompany.id,
          name: firstCompany.name,
          emailAddress: firstCompany.emailAddress,
          logo: firstCompany.logo,
          accountNumber: firstCompany.accountNumber,
        };
        authStorage.setUser(basicInfo);
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          user: basicInfo,
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
    fetchBasicCompanyInfo,
  };
}

