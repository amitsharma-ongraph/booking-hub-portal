/**
 * JWT Token Utilities
 * Decodes JWT tokens to extract user information
 */

export interface JwtPayload {
  sub?: string; // Subject (usually user ID or phone number)
  iat?: number; // Issued at (timestamp)
  exp?: number; // Expiration (timestamp)
  [key: string]: unknown; // Other claims
}

/**
 * Decode JWT token payload (without verification)
 * Note: This only decodes, doesn't verify signature
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (second part)
    const payload = parts[1];
    
    // Add padding if needed (base64url decoding)
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    
    // Decode base64
    const decoded = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    
    // Parse JSON
    return JSON.parse(decoded) as JwtPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) {
    return true; // If no expiration, consider expired
  }

  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now();
}

/**
 * Get user identifier from JWT token
 * Returns phone number or user ID from 'sub' claim
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJwt(token);
  return payload?.sub || null;
}

