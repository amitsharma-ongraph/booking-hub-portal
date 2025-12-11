/**
 * useCompanies Hook
 * Provides company-specific operations and data fetching
 * Note: For detailed company data, use CompanyContext instead
 * This hook is kept for backward compatibility and specific use cases
 */

import { useState, useCallback } from 'react';
import { companiesService } from '@/lib/api/companies/companiesService';
import type { ApiError } from '@/lib/api/client';
import type { CompanyDto } from '@/lib/api/companies/types';

interface CompaniesState {
  isLoading: boolean;
  error: string | null;
}

export function useCompanies() {
  const [state, setState] = useState<CompaniesState>({
    isLoading: false,
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
   * Get company by ID
   */
  const getCompanyById = useCallback(
    async (id: string): Promise<CompanyDto> => {
      setLoading(true);
      setError(null);

      try {
        const company = await companiesService.getCompanyById(id);
        return company;
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.errorMessage || 'Failed to fetch company';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,

    // Functions
    getCompanyById,
    clearError,
  };
}


