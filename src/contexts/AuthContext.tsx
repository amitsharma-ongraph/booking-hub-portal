/**
 * Auth Context
 * Provides global authentication state throughout the app
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import type { BasicCompanyInfo } from '@/hooks/auth/useAuth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: BasicCompanyInfo | null;
  error: string | null;
  requestOtp: (phoneNumber: string) => Promise<string>;
  verifyOtpAndLogin: (phoneNumber: string, otp: string) => Promise<void>;
  register: (data: {
    emailAddress: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    firebaseToken?: string;
  }) => Promise<BasicCompanyInfo>;
  logout: () => void;
  validateToken: () => Promise<boolean>;
  clearError: () => void;
  fetchBasicCompanyInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

