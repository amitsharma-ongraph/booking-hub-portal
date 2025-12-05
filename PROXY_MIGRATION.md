# Proxy to Direct API Migration Guide

## Current Setup
The app currently uses Next.js API routes as a proxy to bypass CORS issues. This is a temporary workaround.

## When Backend CORS is Fixed

### Step 1: Update Environment Variables
Add to your `.env.local`:
```env
NEXT_PUBLIC_USE_API_PROXY=false
NEXT_PUBLIC_API_BASE_URL=http://api.yourbookinghub.com:8080/api/bwm
```

### Step 2: Delete Proxy Routes
Delete the following files/directories:
- `src/app/api/auth/otp/route.ts`
- `src/app/api/auth/otp/verify/route.ts`
- `src/app/api/auth/token/route.ts`
- `src/app/api/auth/customers/route.ts`
- `src/app/api/auth/` (entire directory)

### Step 3: Test
1. Clear browser cache and cookies
2. Test login flow
3. Test protected routes
4. Verify API calls work directly

## How It Works

The `authService` automatically switches between proxy and direct API calls based on `NEXT_PUBLIC_USE_API_PROXY`:

- **Proxy mode (default)**: Uses `/api/auth/*` routes
- **Direct mode**: Uses `NEXT_PUBLIC_API_BASE_URL` directly

No code changes needed - just environment variables!

