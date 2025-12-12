/**
 * useCategories Hook
 * Provides category-specific operations and data fetching
 * Uses centralized state management for real-time updates across the app
 */

import { useState, useCallback } from 'react';
import { categoriesService } from '@/lib/api/categories/categoriesService';
import type { ApiError } from '@/lib/api/client';
import type { CategoryDto } from '@/lib/api/categories/types';

interface CategoriesState {
  categories: CategoryDto[];
  isLoading: boolean;
  error: string | null;
}

export function useCategories() {
  const [state, setState] = useState<CategoriesState>({
    categories: [],
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
   * Get categories by company ID
   */
  const getCategoriesByCompanyId = useCallback(
    async (companyId: string): Promise<CategoryDto[]> => {
      setLoading(true);
      setError(null);

      try {
        const categories = await categoriesService.getCategoriesByCompanyId(companyId);
        setState((prev) => ({ ...prev, categories, isLoading: false }));
        return categories;
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.errorMessage || 'Failed to fetch categories';
        setError(errorMessage);
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [setLoading, setError]
  );

  /**
   * Update categories state (for optimistic updates or after mutations)
   */
  const setCategories = useCallback((categories: CategoryDto[]) => {
    setState((prev) => ({ ...prev, categories }));
  }, []);

  /**
   * Add a new category to the state
   */
  const addCategory = useCallback((category: CategoryDto) => {
    setState((prev) => ({
      ...prev,
      categories: [...prev.categories, category],
    }));
  }, []);

  /**
   * Update an existing category in the state
   */
  const updateCategory = useCallback((categoryId: string, updatedCategory: Partial<CategoryDto>) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, ...updatedCategory } : cat
      ),
    }));
  }, []);

  /**
   * Remove a category from the state
   */
  const removeCategory = useCallback((categoryId: string) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.id !== categoryId),
    }));
  }, []);

  /**
   * Add an option to a category
   */
  const addOptionToCategory = useCallback(
    (categoryId: string, option: CategoryDto['options'][0]) => {
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, options: [...cat.options, option] }
            : cat
        ),
      }));
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
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                options: cat.options.map((opt) =>
                  opt.id === optionId ? { ...opt, ...updatedOption } : opt
                ),
              }
            : cat
        ),
      }));
    },
    []
  );

  /**
   * Remove an option from a category
   */
  const removeOptionFromCategory = useCallback((categoryId: string, optionId: string) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, options: cat.options.filter((opt) => opt.id !== optionId) }
          : cat
      ),
    }));
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  /**
   * Refresh categories (re-fetch from API)
   */
  const refreshCategories = useCallback(
    async (companyId: string) => {
      return getCategoriesByCompanyId(companyId);
    },
    [getCategoriesByCompanyId]
  );

  return {
    // State
    categories: state.categories,
    isLoading: state.isLoading,
    error: state.error,

    // Functions
    getCategoriesByCompanyId,
    setCategories,
    addCategory,
    updateCategory,
    removeCategory,
    addOptionToCategory,
    updateOptionInCategory,
    removeOptionFromCategory,
    refreshCategories,
    clearError,
  };
}
