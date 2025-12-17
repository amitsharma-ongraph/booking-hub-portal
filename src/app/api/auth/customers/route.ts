/**
 * Next.js API Route - Customers Proxy
 * 
 * TODO: Delete this file after backend CORS is configured.
 * Set NEXT_PUBLIC_USE_API_PROXY=false to switch to direct API calls.
 */

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.yourbookinghub.com:8080/api/bwm';

// Ensure customer lookups are never served from a stale cache
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { errorCode: 'server-error', errorMessage: 'Internal server error', type: 'technical' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phoneNumber = searchParams.get('phone-number');

    const url = phoneNumber
      ? `${API_BASE_URL}/customers?phone-number=${encodeURIComponent(phoneNumber)}`
      : `${API_BASE_URL}/customers`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { errorCode: 'server-error', errorMessage: 'Internal server error', type: 'technical' },
      { status: 500 }
    );
  }
}
