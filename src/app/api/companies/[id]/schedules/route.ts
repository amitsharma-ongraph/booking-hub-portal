/**
 * Next.js API Route - Company Schedules Proxy
 * 
 * TODO: Delete this file after backend CORS is configured.
 * Set NEXT_PUBLIC_USE_API_PROXY=false to switch to direct API calls.
 */

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.yourbookinghub.com:8080/api/bwm';

// Always fetch fresh schedules for a company
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const url = `${API_BASE_URL}/companies/${id}/schedules`;

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
