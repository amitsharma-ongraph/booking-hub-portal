/**
 * Categories Service
 * Contains all category-related API calls
 */

import type { CategoryDto, CreateOptionRequestDto, CreateOptionResponseDto, UpdateCategoryRequestDto, UpdateCategoryResponseDto, UpdateOptionRequestDto, UpdateOptionResponseDto, CreateCategoryRequestDto, CreateCategoryResponseDto } from './types';
import type { ApiError } from '../client';

// Configuration: Use proxy by default, can be switched via env var
const USE_PROXY = process.env.NEXT_PUBLIC_USE_API_PROXY !== 'false';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.yourbookinghub.com:8080/api/bwm';
const API_BASE = USE_PROXY ? '/api' : API_BASE_URL;

class CategoriesService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token for direct API calls (not needed for proxy)
    if (!USE_PROXY && typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let error: ApiError;
      try {
        error = await response.json();
      } catch {
        error = {
          errorCode: 'unknown-error',
          errorMessage: `HTTP ${response.status}: ${response.statusText}`,
          type: 'technical',
        };
      }
      throw error;
    }

    // Handle empty responses (e.g., DELETE requests with 204 No Content)
    if (response.status === 204 || (response.status === 200 && response.headers.get('content-length') === '0')) {
      return undefined as T;
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return undefined as T;
    }

    // Check if response has content
    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    return JSON.parse(text);
  }

  /**
   * Get categories by company ID
   * Returns all categories with their options for a given company
   */
  async getCategoriesByCompanyId(companyId: string): Promise<CategoryDto[]> {
    return this.fetchApi<CategoryDto[]>(`/companies/${companyId}/categories`, {
      method: 'GET',
    });
  }

  /**
   * Create a new category
   * Returns the created category with id, name, and options array
   */
  async createCategory(data: CreateCategoryRequestDto): Promise<CreateCategoryResponseDto> {
    return this.fetchApi<CreateCategoryResponseDto>(`/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Create a new option for a category
   * Returns the created option with id, name, and price
   */
  async createOption(data: CreateOptionRequestDto): Promise<CreateOptionResponseDto> {
    return this.fetchApi<CreateOptionResponseDto>(`/categories/options`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a category name
   * Returns the updated category with id and name
   */
  async updateCategory(categoryId: string, data: UpdateCategoryRequestDto): Promise<UpdateCategoryResponseDto> {
    return this.fetchApi<UpdateCategoryResponseDto>(`/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a category by ID
   */
  async deleteCategory(categoryId: string): Promise<void> {
    await this.fetchApi<void>(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Update a category option
   * Returns the updated option with id, name, and price
   */
  async updateOption(categoryId: string, optionId: string, data: UpdateOptionRequestDto): Promise<UpdateOptionResponseDto> {
    return this.fetchApi<UpdateOptionResponseDto>(`/categories/${categoryId}/options/${optionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a category option by category ID and option ID
   */
  async deleteOption(categoryId: string, optionId: string): Promise<void> {
    await this.fetchApi<void>(`/categories/${categoryId}/options/${optionId}`, {
      method: 'DELETE',
    });
  }
}

export const categoriesService = new CategoriesService();
