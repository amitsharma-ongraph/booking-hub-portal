/**
 * Company Context
 * Provides detailed company data throughout the app
 * Auto-fetches company data when user is authenticated
 */

'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { companiesService } from '@/lib/api/companies/companiesService';
import { useAuthContext } from './AuthContext';
import type { CompanyDto } from '@/lib/api/companies/types';
import type { ApiError } from '@/lib/api/client';

interface CompanyContextType {
  company: CompanyDto | null;
  isLoading: boolean;
  error: string | null;
  refreshCompany: () => Promise<void>;
  clearError: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthContext();
  const [company, setCompanyState] = useState<CompanyDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);

  /**
   * Fetch detailed company data by ID
   * Internal function used by auto-fetch and refresh
   */
  const fetchCompanyDetails = useCallback(async (companyId: string) => {
    // If we already have this company's data and no error, don't fetch again
    if (company?.id === companyId && !error) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const companyData = await companiesService.getCompanyById(companyId);
      console.log('🏢 Company data fetched in CompanyContext:', companyData);
      setCompanyState(companyData);
      setCurrentCompanyId(companyId);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.errorMessage || 'Failed to fetch company details');
      setCompanyState(null);
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, error]);

  /**
   * Auto-fetch company data when user is authenticated
   * Only fetches if:
   * - User is authenticated
   * - User ID is available
   * - Company data is not already loaded
   * - Not currently loading
   */
  useEffect(() => {
    if (isAuthenticated && user?.id && !company && !isLoading) {
      fetchCompanyDetails(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]); // Only fetch when auth state or user ID changes

  /**
   * Refresh company data (re-fetch current company)
   * Useful when you need fresh data (e.g., after updates)
   */
  const refreshCompany = useCallback(async () => {
    if (currentCompanyId) {
      await fetchCompanyDetails(currentCompanyId);
    } else if (user?.id) {
      // If no currentCompanyId but we have user ID, fetch it
      await fetchCompanyDetails(user.id);
    }
  }, [currentCompanyId, user?.id, fetchCompanyDetails]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        company,
        isLoading,
        error,
        refreshCompany,
        clearError,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanyContext() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanyContext must be used within a CompanyProvider');
  }
  return context;
}

