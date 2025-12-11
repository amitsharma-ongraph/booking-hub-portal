/**
 * Auth Service
 * Contains all authentication-related API calls
 * 
 * NOTE: Currently uses Next.js API routes as proxy to bypass CORS issues.
 * To switch to direct API calls (after backend CORS is fixed):
 * 1. Set NEXT_PUBLIC_USE_API_PROXY=false in .env
 * 2. Set NEXT_PUBLIC_API_BASE_URL to your backend URL
 * 3. Delete the proxy routes in src/app/api/auth/
 */

import type {
  OtpRequestDto,
  OtpResponseDto,
  OtpVerificationDto,
  AuthRequestDto,
  AuthResponseDto,
  CustomerDto,
  CustomerCreationDto,
} from './types';
import type { ApiError } from '../client';

// Configuration: Use proxy by default, can be switched via env var
const USE_PROXY = process.env.NEXT_PUBLIC_USE_API_PROXY !== 'false';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.yourbookinghub.com:8080/api/bwm';
const API_BASE = USE_PROXY ? '/api/auth' : API_BASE_URL;

class AuthService {
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

    // Handle empty responses (like OTP verify which returns 200 with no body)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    // Check if response has content
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text);
  }

  /**
   * Request OTP for phone number
   */
  async requestOtp(data: OtpRequestDto): Promise<OtpResponseDto> {
    return this.fetchApi<OtpResponseDto>('/otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(data: OtpVerificationDto): Promise<void> {
    return this.fetchApi<void>('/otp/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get authentication token
   */
  async getAuthToken(data: AuthRequestDto): Promise<AuthResponseDto> {
    return this.fetchApi<AuthResponseDto>('/auth', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Register new customer
   */
  async register(data: CustomerCreationDto): Promise<CustomerDto> {
    return this.fetchApi<CustomerDto>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get customer by phone number
   */
  async getCustomerByPhone(phoneNumber: string): Promise<CustomerDto[]> {
    return this.fetchApi<CustomerDto[]>(`/customers?phone-number=${encodeURIComponent(phoneNumber)}`, {
      method: 'GET',
    });
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: string): Promise<CustomerDto> {
    return this.fetchApi<CustomerDto>(`/customers/${id}`, {
      method: 'GET',
    });
  }
}

export const authService = new AuthService();

