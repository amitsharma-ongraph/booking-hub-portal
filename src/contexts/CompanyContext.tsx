/**
 * Company Context
 * Provides detailed company data throughout the app
 * Auto-fetches company data when user is authenticated
 */

'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { companiesService } from '@/lib/api/companies/companiesService';
import { useAuthContext } from './AuthContext';
import type { CompanyDto, UpdateCompanyRequestDto } from '@/lib/api/companies/types';
import type { ApiError } from '@/lib/api/client';

export interface DashboardData {
  totalBookings: number;
  upcomingSchedules: number;
  averageRating: number;
}

interface CompanyContextType {
  company: CompanyDto | null;
  isLoading: boolean;
  error: string | null;
  refreshCompany: () => Promise<void>;
  updateCompany: (data: UpdateCompanyRequestDto) => Promise<void>;
  clearError: () => void;
  getDashboardData: () => DashboardData;
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
   * Update company data
   * Updates the company and refreshes the data
   */
  const updateCompany = useCallback(async (data: UpdateCompanyRequestDto) => {
    const companyIdToUpdate = company?.id || currentCompanyId || user?.id;
    
    if (!companyIdToUpdate) {
      throw new Error('Cannot update company: no company ID available');
    }

    console.log('🔄 Updating company:', companyIdToUpdate, data);
    setIsLoading(true);
    setError(null);

    try {
      const updatedCompany = await companiesService.updateCompany(companyIdToUpdate, data);
      console.log('✅ Company updated successfully:', updatedCompany);
      setCompanyState(updatedCompany);
      setCurrentCompanyId(companyIdToUpdate);
    } catch (err) {
      const apiError = err as ApiError;
      console.error('❌ Error updating company:', err);
      setError(apiError.errorMessage || 'Failed to update company');
      throw err; // Re-throw so caller can handle it
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, currentCompanyId, user?.id]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get dashboard data from company object
   * Calculates total bookings, upcoming schedules, and average rating
   */
  const getDashboardData = useCallback((): DashboardData => {
    if (!company) {
      return {
        totalBookings: 0,
        upcomingSchedules: 0,
        averageRating: 0,
      };
    }

    // Calculate total bookings
    const totalBookings = company.bookings?.length || 0;

    // Calculate upcoming schedules
    // Go through categories -> options -> schedules and count upcoming ones
    let upcomingSchedules = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    if (company.categories) {
      company.categories.forEach((category) => {
        if (category.options) {
          category.options.forEach((option) => {
            if (option.schedules) {
              option.schedules.forEach((schedule) => {
                // Check if schedule start date is today or in the future
                const scheduleDate = new Date(schedule.startDate);
                scheduleDate.setHours(0, 0, 0, 0);
                if (scheduleDate >= today) {
                  upcomingSchedules++;
                }
              });
            }
          });
        }
      });
    }

    // Calculate average rating
    let averageRating = 0;
    if (company.ratings && company.ratings.length > 0) {
      const totalScore = company.ratings.reduce((sum, rating) => sum + (rating.score || 0), 0);
      averageRating = totalScore / company.ratings.length;
      // Round to 1 decimal place
      averageRating = Math.round(averageRating * 10) / 10;
    }

    return {
      totalBookings,
      upcomingSchedules,
      averageRating,
    };
  }, [company]);

  return (
    <CompanyContext.Provider
      value={{
        company,
        isLoading,
        error,
        refreshCompany,
        updateCompany,
        clearError,
        getDashboardData,
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

