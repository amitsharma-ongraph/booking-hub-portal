/**
 * Categories Context
 * Provides centralized category data throughout the app
 * Auto-fetches category data when company ID is available
 */

'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { categoriesService } from '@/lib/api/categories/categoriesService';
import { useAuthContext } from './AuthContext';
import type { CategoryDto } from '@/lib/api/categories/types';
import type { ApiError } from '@/lib/api/client';

interface CategoriesContextType {
  categories: CategoryDto[];
  isLoading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
  clearError: () => void;
  // State update methods for optimistic updates
  addCategory: (category: CategoryDto) => void;
  updateCategory: (categoryId: string, updatedCategory: Partial<CategoryDto>) => void;
  removeCategory: (categoryId: string) => void;
  addOptionToCategory: (categoryId: string, option: CategoryDto['options'][0]) => void;
  updateOptionInCategory: (
    categoryId: string,
    optionId: string,
    updatedOption: Partial<CategoryDto['options'][0]>
  ) => void;
  removeOptionFromCategory: (categoryId: string, optionId: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthContext();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);

  /**
   * Fetch categories data by company ID
   * Internal function used by auto-fetch and refresh
   */
  const fetchCategories = useCallback(async (companyId: string) => {
    // If we already have categories for this company and no error, don't fetch again
    if (currentCompanyId === companyId && categories.length > 0 && !error) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const categoriesData = await categoriesService.getCategoriesByCompanyId(companyId);
      console.log('📁 Categories data fetched in CategoriesContext:', categoriesData);
      setCategories(categoriesData);
      setCurrentCompanyId(companyId);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.errorMessage || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentCompanyId, categories.length, error]);

  /**
   * Auto-fetch categories data when user is authenticated
   * Only fetches if:
   * - User is authenticated
   * - User ID (company ID) is available
   * - Categories data is not already loaded
   * - Not currently loading
   */
  useEffect(() => {
    if (isAuthenticated && user?.id && categories.length === 0 && !isLoading) {
      fetchCategories(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]); // Only fetch when auth state or user ID changes

  /**
   * Refresh categories data (re-fetch current company's categories)
   * Useful when you need fresh data (e.g., after updates)
   */
  const refreshCategories = useCallback(async () => {
    if (currentCompanyId) {
      await fetchCategories(currentCompanyId);
    } else if (user?.id) {
      // If no currentCompanyId but we have user ID, fetch it
      await fetchCategories(user.id);
    }
  }, [currentCompanyId, user?.id, fetchCategories]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Add a new category to the state
   */
  const addCategory = useCallback((category: CategoryDto) => {
    setCategories((prev) => [...prev, category]);
  }, []);

  /**
   * Update an existing category in the state
   */
  const updateCategory = useCallback((categoryId: string, updatedCategory: Partial<CategoryDto>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, ...updatedCategory } : cat))
    );
  }, []);

  /**
   * Remove a category from the state
   */
  const removeCategory = useCallback((categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  }, []);

  /**
   * Add an option to a category
   */
  const addOptionToCategory = useCallback(
    (categoryId: string, option: CategoryDto['options'][0]) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, options: [...cat.options, option] } : cat
        )
      );
    },
    []
  );

  /**
   * Update an option in a category
   */
  const updateOptionInCategory = useCallback(
    (
      categoryId: string,
      optionId: string,
      updatedOption: Partial<CategoryDto['options'][0]>
    ) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                options: cat.options.map((opt) =>
                  opt.id === optionId ? { ...opt, ...updatedOption } : opt
                ),
              }
            : cat
        )
      );
    },
    []
  );

  /**
   * Remove an option from a category
   */
  const removeOptionFromCategory = useCallback((categoryId: string, optionId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, options: cat.options.filter((opt) => opt.id !== optionId) }
          : cat
      )
    );
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        isLoading,
        error,
        refreshCategories,
        clearError,
        addCategory,
        updateCategory,
        removeCategory,
        addOptionToCategory,
        updateOptionInCategory,
        removeOptionFromCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategoriesContext() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategoriesContext must be used within a CategoriesProvider');
  }
  return context;
}
