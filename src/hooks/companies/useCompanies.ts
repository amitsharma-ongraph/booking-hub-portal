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

/**
 * Booking data for bookings UI
 */
export interface Booking {
  id: string;
  companyId: string;
  customerId: string;
  price: number;
  status: string;
  customerName: string;
  rated: boolean;
  numberOfSeats: number;
}

/**
 * Booking session data for bookings UI
 */
export interface BookingSession {
  id: string;
  totalNumberOfSeats: number;
  availableNumberOfSeats: number;
  startTime: string;
  endTime: string;
  bookings: Booking[];
}

/**
 * Booking option data for bookings UI
 */
export interface BookingOption {
  id: string;
  name: string;
  price: number;
  sessions: BookingSession[];
  totalSessions: number;
  totalSeats: number;
  bookedSeats: number;
  totalPrice: number;
}

/**
 * Booking category data for bookings UI
 */
export interface BookingCategory {
  categoryId: string;
  name: string;
  options: BookingOption[];
  totalSessions: number;
  totalSeats: number;
  bookedSeats: number;
  totalPrice: number;
}

/**
 * Available category for filter dropdown
 */
export interface AvailableCategory {
  id: string;
  name: string;
}

/**
 * Available option for filter dropdown
 */
export interface AvailableOption {
  id: string;
  name: string;
  categoryId: string; // To link option to its category
}

/**
 * Bookings data structure
 * Contains all data needed for the bookings page
 * Can be extended with more properties as needed
 */
export interface BookingsData {
  date: string; // The date used for filtering sessions
  categories: BookingCategory[];
  availableCategories: AvailableCategory[];
  availableOptions: AvailableOption[];
}

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

  /**
   * Transform company data to get bookings data
   * Returns structured data for the bookings page filtered by date, category, and option
   * @param company - Company data from API
   * @param filterDate - Optional date to filter sessions. If not provided, uses the most recent date
   * @param categoryFilter - Optional category ID to filter. If "all" or not provided, shows all categories
   * @param optionFilter - Optional option ID to filter. If "all" or not provided, shows all options for selected category
   */
  const getBookingsData = useCallback(
    (
      company: CompanyDto | null,
      filterDate?: string | null,
      categoryFilter?: string | null,
      optionFilter?: string | null
    ): BookingsData => {
      if (!company || !company.categories) {
        return {
          date: filterDate || '',
          categories: [],
          availableCategories: [],
          availableOptions: [],
        };
      }

      // Handle empty categories array gracefully
      if (company.categories.length === 0) {
        return {
          date: filterDate || '',
          categories: [],
          availableCategories: [],
          availableOptions: [],
        };
      }

      // Helper function to extract date part (YYYY-MM-DD) from ISO string
      const extractDatePart = (isoString: string): string => {
        return isoString.split('T')[0];
      };

      // Collect all unique schedule date parts across all categories, options, and schedules
      const allDateParts = new Set<string>();
      company.categories.forEach((category) => {
        category.options.forEach((option) => {
          option.schedules.forEach((schedule) => {
            const datePart = extractDatePart(schedule.startDate);
            allDateParts.add(datePart);
          });
        });
      });

      // If no filter date provided, find the most recent date part
      let selectedDatePart: string | null = filterDate || null;
      if (!selectedDatePart && allDateParts.size > 0) {
        // Sort date parts descending (latest first) and pick the first one
        const sortedDates = Array.from(allDateParts).sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );
        selectedDatePart = sortedDates[0];
      }
      
      // Ensure selectedDatePart is a valid string before filtering
      // Only log error if there are categories but no dates (unexpected scenario)
      if (!selectedDatePart) {
        // Only log error if we have categories but no dates found (this is unexpected)
        if (allDateParts.size === 0) {
          // This is expected when there are no schedules, so we don't log an error
          // Just return empty data gracefully
        } else {
          // This shouldn't happen, but log it for debugging
          console.warn('⚠️ No valid date selected for filtering sessions');
        }
        return {
          date: '',
          categories: [],
          availableCategories: [],
          availableOptions: [],
        };
      }

      // Filter and transform categories with sessions for the selected date
      // First, filter by category if specified
      let filteredCategories = company.categories;
      if (categoryFilter && categoryFilter !== 'all') {
        filteredCategories = company.categories.filter((cat) => cat.id === categoryFilter);
      }

      // Transform categories with date filtering
      const categories: BookingCategory[] = filteredCategories.map((category) => {
        // Filter options by optionFilter if specified
        let filteredOptions = category.options;
        if (optionFilter && optionFilter !== 'all') {
          filteredOptions = category.options.filter((opt) => opt.id === optionFilter);
        }

        // Map options and calculate their statistics
        const options = filteredOptions.map((option) => {
          // Collect all sessions from schedules matching the selected date part
          const filteredSessions: BookingSession[] = [];

          option.schedules.forEach((schedule) => {
            // Extract date part from schedule's startDate and compare
            const scheduleDatePart = extractDatePart(schedule.startDate);
            if (scheduleDatePart === selectedDatePart) {
              schedule.sessions.forEach((session) => {
                filteredSessions.push({
                  id: session.id,
                  totalNumberOfSeats: session.totalNumberOfSeats,
                  availableNumberOfSeats: session.availableNumberOfSeats,
                  startTime: session.startTime,
                  endTime: session.endTime,
                  bookings: session.bookings.map((booking) => ({
                    id: booking.id,
                    companyId: booking.companyId,
                    customerId: booking.customerId,
                    price: booking.price,
                    status: booking.status,
                    customerName: booking.customerName,
                    rated: booking.rated,
                    numberOfSeats: booking.numberOfSeats,
                  })),
                });
              });
            }
          });

          // Calculate aggregated statistics for this option
          const totalSessions = filteredSessions.length;
          const totalSeats = filteredSessions.reduce(
            (sum, session) => sum + session.totalNumberOfSeats,
            0
          );
          const bookedSeats = filteredSessions.reduce(
            (sum, session) => sum + (session.totalNumberOfSeats - session.availableNumberOfSeats),
            0
          );
          // Calculate total price: option price * booked seats
          const totalPrice = option.price * bookedSeats;

          return {
            id: option.id,
            name: option.name,
            price: option.price,
            sessions: filteredSessions,
            totalSessions,
            totalSeats,
            bookedSeats,
            totalPrice,
          };
        });

        // Calculate aggregated statistics for this category (sum from all options)
        const categoryTotalSessions = options.reduce(
          (sum, option) => sum + option.totalSessions,
          0
        );
        const categoryTotalSeats = options.reduce(
          (sum, option) => sum + option.totalSeats,
          0
        );
        const categoryBookedSeats = options.reduce(
          (sum, option) => sum + option.bookedSeats,
          0
        );
        const categoryTotalPrice = options.reduce(
          (sum, option) => sum + option.totalPrice,
          0
        );

        return {
          categoryId: category.id,
          name: category.name,
          options,
          totalSessions: categoryTotalSessions,
          totalSeats: categoryTotalSeats,
          bookedSeats: categoryBookedSeats,
          totalPrice: categoryTotalPrice,
        };
      });

      // Extract available categories and options for filters
      const availableCategories: AvailableCategory[] = company.categories.map((category) => ({
        id: category.id,
        name: category.name,
      }));

      const availableOptions: AvailableOption[] = [];
      company.categories.forEach((category) => {
        category.options.forEach((option) => {
          availableOptions.push({
            id: option.id,
            name: option.name,
            categoryId: category.id,
          });
        });
      });

      return {
        date: selectedDatePart || '',
        categories,
        availableCategories,
        availableOptions,
      };
    },
    []
  );

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,

    // Functions
    getCompanyById,
    getBookingsData,
    clearError,
  };
}


