// src/lib/auth-middleware.ts

import { jwtVerify } from 'jose';
import { authOptions } from 'lib/auth';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

// Helper to generate secret key for JWT verification
async function generateSecretKey() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return new TextEncoder().encode(secret);
}

// Verify JWT token
async function verifyJWT(token: string) {
  try {
    const secret = await generateSecretKey();
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'urn:example:issuer',
      audience: 'urn:example:audience',
    });
    return { isValid: true, payload };
  } catch (error) {
    return { isValid: false, error };
  }
}

// Combined authentication middleware
export async function authenticate(request: NextRequest) {
  // First try to get session (for web clients)
  const session = await getServerSession(authOptions);
  if (session) {
    return {
      isAuthenticated: true,
      data: session,
      type: 'session',
    };
  }

  // If no session, check for JWT token (for mobile clients)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const { isValid, payload, error } = await verifyJWT(token);

    if (isValid && payload) {
      return {
        isAuthenticated: true,
        data: payload,
        type: 'jwt',
      };
    }

    return {
      isAuthenticated: false,
      error: error || 'Invalid token',
      type: 'jwt',
    };
  }

  return {
    isAuthenticated: false,
    error: 'No authentication provided',
    type: null,
  };
}
