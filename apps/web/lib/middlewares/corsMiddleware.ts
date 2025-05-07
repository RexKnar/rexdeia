// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Apply CORS headers globally to all API requests, including NextAuth routes
  res.headers.set('Access-Control-Allow-Origin', '*'); // Update with your frontend URL in production
  res.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  // Handle OPTIONS preflight requests for CORS
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

// This will apply middleware to all routes under `/api`
export const config = {
  matcher: ['/api/:path*', '/auth/:path*'],
};
