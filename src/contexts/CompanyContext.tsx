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
   * @param companyId - The company ID to fetch
   * @param force - If true, force refetch even if data already exists
   */
  const fetchCompanyDetails = useCallback(async (companyId: string, force: boolean = false) => {
    // If we already have this company's data and no error, don't fetch again (unless forced)
    if (!force && company?.id === companyId && !error) {
      console.log('⏭️ Skipping fetch - company data already exists and not forced');
      return;
    }

    console.log('📡 Making API call to fetch company:', companyId, { force });
    setIsLoading(true);
    setError(null);

    try {
      const companyData = await companiesService.getCompanyById(companyId);
      console.log('✅ Company data fetched in CompanyContext:', companyData);
      setCompanyState(companyData);
      setCurrentCompanyId(companyId);
    } catch (err) {
      const apiError = err as ApiError;
      console.error('❌ Error fetching company:', err);
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
   * Forces a refetch even if data already exists
   */
  const refreshCompany = useCallback(async () => {
    console.log('🔄 refreshCompany called', { currentCompanyId, userId: user?.id, companyId: company?.id });
    
    // Use company.id if available (most reliable), otherwise fall back to currentCompanyId or user.id
    const companyIdToFetch = company?.id || currentCompanyId || user?.id;
    
    if (companyIdToFetch) {
      console.log('📡 Fetching company data for ID:', companyIdToFetch);
      await fetchCompanyDetails(companyIdToFetch, true); // Force refetch
    } else {
      console.warn('⚠️ Cannot refresh company: no company ID available', { currentCompanyId, userId: user?.id, companyId: company?.id });
    }
  }, [currentCompanyId, user?.id, company?.id, fetchCompanyDetails]);

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

