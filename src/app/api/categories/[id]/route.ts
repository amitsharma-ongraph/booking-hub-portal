/**
 * Next.js API Route - Update/Delete Category Proxy
 * 
 * TODO: Delete this file after backend CORS is configured.
 * Set NEXT_PUBLIC_USE_API_PROXY=false to switch to direct API calls.
 */

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.yourbookinghub.com:8080/api/bwm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const url = `${API_BASE_URL}/categories/${id}`;

    const response = await fetch(url, {
      method: 'PUT',
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const url = `${API_BASE_URL}/categories/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle empty response for DELETE
    if (response.status === 204 || response.status === 200) {
      return new NextResponse(null, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { errorCode: 'server-error', errorMessage: 'Internal server error', type: 'technical' },
      { status: 500 }
    );
  }
}
