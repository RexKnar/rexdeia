// Shared CORS helper. Kept in sync with the root middleware.ts allow-list logic
// so it can never reintroduce the insecure "reflect any origin + credentials" pattern.
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ALLOWED_METHODS = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
const ALLOWED_HEADERS =
  'Content-Type, Authorization, X-Requested-With, X-HTTP-Method-Override, Accept';

const DEV_FALLBACK_ORIGINS = [
  'http://localhost:3000',
  'http://localhost',
  'http://10.0.2.2',
];

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

export function applyCors(req: NextRequest, res: NextResponse): NextResponse {
  const origin = req.headers.get('origin') || '';
  const isAllowedOrigin = origin !== '' && getAllowedOrigins().includes(origin);

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

export function middleware(req: NextRequest) {
  const res =
    req.method === 'OPTIONS'
      ? new NextResponse(null, { status: 204 })
      : NextResponse.next();
  return applyCors(req, res);
}

export const config = {
  matcher: ['/api/:path*', '/auth/:path*'],
};
