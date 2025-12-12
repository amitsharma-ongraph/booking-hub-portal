/**
 * Schedules Service
 * Contains all schedule-related API calls
 */

import type { ScheduleDto } from './types';
import type { ApiError } from '../client';

// Configuration: Use proxy by default, can be switched via env var
const USE_PROXY = process.env.NEXT_PUBLIC_USE_API_PROXY !== 'false';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.yourbookinghub.com:8080/api/bwm';
const API_BASE = USE_PROXY ? '/api' : API_BASE_URL;

class SchedulesService {
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

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return [] as T;
    }

    // Check if response has content
    const text = await response.text();
    if (!text) {
      return [] as T;
    }

    return JSON.parse(text);
  }

  /**
   * Get schedules by company ID
   */
  async getSchedulesByCompanyId(companyId: string): Promise<ScheduleDto[]> {
    return this.fetchApi<ScheduleDto[]>(`/companies/${companyId}/schedules`, {
      method: 'GET',
    });
  }
}

export const schedulesService = new SchedulesService();
