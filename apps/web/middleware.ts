// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ALLOWED_METHODS = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
const ALLOWED_HEADERS =
  'Content-Type, Authorization, X-Requested-With, X-HTTP-Method-Override, Accept';

// Localhost origins are only allowed outside production so local web/Flutter
// development keeps working without configuration.
const DEV_FALLBACK_ORIGINS = [
  'http://localhost:3000',
  'http://localhost',
  'http://10.0.2.2',
];

// Configure production origins via the ALLOWED_ORIGINS env var
// (comma-separated, e.g. "https://app.rexdeia.com,https://admin.rexdeia.com").
function getAllowedOrigins(): string[] {
  const fromEnv = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  if (fromEnv.length > 0) {
    return fromEnv;
  }

  return process.env.NODE_ENV === 'production' ? [] : DEV_FALLBACK_ORIGINS;
}

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const isAllowedOrigin = origin !== '' && getAllowedOrigins().includes(origin);

  const res =
    req.method === 'OPTIONS'
      ? new NextResponse(null, { status: 204 })
      : NextResponse.next();

  // Only emit CORS headers for explicitly allowed origins. Credentials are
  // NEVER combined with a wildcard or a blindly reflected origin.
  if (isAllowedOrigin) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Vary', 'Origin');
    res.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS);
    res.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS);
    res.headers.set('Access-Control-Max-Age', '86400');
  }

  return res;
}

// Apply middleware to API and auth routes
export const config = {
  matcher: ['/api/:path*', '/auth/:path*'],
};
