// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Get origin from request
  const origin = req.headers.get('origin') || '';

  // Define allowed origins
  const allowedOrigins = [
    // Add your Flutter app's origins here for production
    // For example:
    // 'https://your-flutter-app-domain.com',
    // For development with Flutter:
    'http://localhost',
    'http://localhost:3000',
    // If needed for Android emulator:
    'http://10.0.2.2',
    // You can keep '*' during development and testing
    '*',
  ];

  // Check if the origin is allowed
  // In production, replace this condition with a check against specific origins
  // const isAllowedOrigin = allowedOrigins.includes(origin);
  // For now, we'll allow all origins during development:
  const isAllowedOrigin = true; // or use: allowedOrigins.includes(origin)

  // Set CORS headers
  res.headers.set(
    'Access-Control-Allow-Origin',
    isAllowedOrigin ? origin : allowedOrigins[0]
  );

  res.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, PATCH'
  );

  res.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, X-HTTP-Method-Override, Accept'
  );

  // Allow credentials (cookies, authorization headers, etc.)
  res.headers.set('Access-Control-Allow-Credentials', 'true');

  // Cache preflight requests for 86400 seconds (24 hours)
  res.headers.set('Access-Control-Max-Age', '86400');

  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: res.headers,
    });
  }

  return res;
}

// Apply middleware to API and auth routes
export const config = {
  matcher: ['/api/:path*', '/auth/:path*'],
};
