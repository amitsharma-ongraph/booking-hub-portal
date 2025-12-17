/**
 * Auth Storage Utilities
 * Handles token and user data storage
 * Also syncs token to cookies for middleware access
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const PENDING_PHONE_KEY = 'pending_phone_number';
const ONBOARDING_FLAG_KEY = 'onboarding_required';

/**
 * Set cookie helper
 */
function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  // Set cookie with proper attributes for middleware access
  // Use SameSite=Lax and path=/ to ensure it's accessible
  const secure = window.location.protocol === 'https:' ? ';Secure' : '';
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${secure}`;
}

/**
 * Remove cookie helper
 */
function removeCookie(name: string): void {
  if (typeof document === 'undefined') return;
  // Remove cookie - try multiple variations to ensure it's cleared
  const hostname = window.location.hostname;
  const paths = ['/', ''];
  const domains = [hostname, `.${hostname}`, ''];
  
  paths.forEach(path => {
    domains.forEach(domain => {
      const domainPart = domain ? `domain=${domain};` : '';
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};${domainPart}SameSite=Lax`;
    });
  });
}

export const authStorage = {
  /**
   * Token management
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    // Also set cookie for middleware access
    setCookie(TOKEN_KEY, token, 7);
  },

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    // Also remove cookie - do this synchronously
    removeCookie(TOKEN_KEY);
    // Force cookie removal by setting empty value
    document.cookie = `${TOKEN_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
  },

  /**
   * User data management
   */
  getUser(): unknown | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser(user: unknown): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Pending phone number (for OTP flow)
   */
  getPendingPhone(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(PENDING_PHONE_KEY);
  },

  setPendingPhone(phoneNumber: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(PENDING_PHONE_KEY, phoneNumber);
  },

  removePendingPhone(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(PENDING_PHONE_KEY);
  },

  /**
   * Clear all auth data
   */
  clearAll(): void {
    this.removeToken();
    this.removeUser();
    this.removePendingPhone();
  },
  
  /**
   * One-time onboarding flag
   * Used to decide whether to send user to onboarding
   * right after login (typically after registration).
   */
  getOnboardingFlag(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ONBOARDING_FLAG_KEY) === 'true';
  },

  setOnboardingFlag(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ONBOARDING_FLAG_KEY, 'true');
  },

  removeOnboardingFlag(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ONBOARDING_FLAG_KEY);
  },
};


