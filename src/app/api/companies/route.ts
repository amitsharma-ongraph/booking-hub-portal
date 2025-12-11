/**
 * Next.js API Route - Companies Proxy
 * 
 * TODO: Delete this file after backend CORS is configured.
 * Set NEXT_PUBLIC_USE_API_PROXY=false to switch to direct API calls.
 */

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.yourbookinghub.com:8080/api/bwm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const service = searchParams.get('service');
    const phoneNumber = searchParams.get('phone-number');

    const params = new URLSearchParams();
    if (service) params.append('service', service);
    if (phoneNumber) params.append('phone-number', phoneNumber);

    const url = `${API_BASE_URL}/companies?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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


