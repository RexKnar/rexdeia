// middleware.ts
import { getToken } from 'next-auth/jwt';
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

// In-memory sliding window rate limiter for brute-force protection
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_MAP_SIZE = 10000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_AUTH_REQUESTS = 20; // 20 requests per minute per IP for sensitive auth routes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Periodic cleanup if map grows too large
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    rateLimitMap.forEach((val, key) => {
      if (val.resetAt < now) {
        rateLimitMap.delete(key);
      }
    });
  }

  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  record.count += 1;
  return record.count > MAX_AUTH_REQUESTS;
}

// Public paths that do not require authentication
const PUBLIC_PATHS = [
  '/signin',
  '/signup',
  '/newsignin',
  '/account-recovery',
  '/setup',
  '/forms',
  '/api-doc',
  '/monitoring',
];

const AUTH_PAGES = ['/signin', '/signup', '/newsignin'];

const RATE_LIMITED_API_PATHS = [
  '/api/register',
  '/api/user/password',
  '/api/mobile/v1/auth',
  '/api/auth/callback/credentials',
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const origin = req.headers.get('origin') || '';
  const isAllowedOrigin = origin !== '' && getAllowedOrigins().includes(origin);

  // 1. CORS Handling for preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    const res = new NextResponse(null, { status: 204 });
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

  // 2. Rate Limiting on sensitive authentication endpoints
  const isRateLimitedEndpoint = RATE_LIMITED_API_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isRateLimitedEndpoint) {
    const ip =
      req.ip ||
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      'unknown-ip';

    if (isRateLimited(ip)) {
      const response = new NextResponse(
        JSON.stringify({
          error: 'TOO_MANY_REQUESTS',
          message:
            'Too many authentication attempts. Please try again in a minute.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
      if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
      return response;
    }
  }

  // 3. UX Optimistic Route Guard for Web Pages
  // (API routes handle their own auth responses with 401/403 JSON payloads, never redirect to HTML)
  const isApiRoute =
    pathname.startsWith('/api/') || pathname.startsWith('/auth/');
  const isPublicPage = PUBLIC_PATHS.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  );

  if (!isApiRoute) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthPage = AUTH_PAGES.some(
      (authPath) =>
        pathname === authPath || pathname.startsWith(`${authPath}/`)
    );

    // If authenticated user visits signin/signup, redirect to home/dashboard
    if (token && isAuthPage) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // If unauthenticated user visits any protected page, redirect to signin
    if (!token && !isPublicPage) {
      const signInUrl = new URL('/signin', req.url);
      if (pathname !== '/') {
        signInUrl.searchParams.set('callbackUrl', pathname);
      }
      return NextResponse.redirect(signInUrl);
    }
  }

  // 4. Default response with CORS headers if allowed origin
  const res = NextResponse.next();
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

// Apply middleware to all relevant routes, excluding static assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
