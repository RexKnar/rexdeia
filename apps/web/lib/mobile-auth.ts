// src/lib/auth/mobile-auth.ts
import bcrypt from 'bcrypt';
import { jwtVerify, SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

import { authOptions } from './auth';
import { db } from './db';

async function generateSecretKey() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return new TextEncoder().encode(secret.trim());
}

export async function createAuthTokens(user: any) {
  const secret = await generateSecretKey();

  // First, get all the required user details like in your session
  const dbUser = await db.user.findFirst({
    where: {
      email: user.email,
    },
    include: {
      createdBranches: true,
      userOrganizations: {
        include: {
          organization: true,
          branch: true,
        },
      },
    },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  // Generate username if not exists (matching your session logic)
  if (!dbUser.username) {
    await db.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        username: nanoid(10),
      },
    });
  }

  // Get academic details (matching your session logic)
  const branchId = dbUser.userOrganizations[0]?.branchId;
  const academicDetails = branchId
    ? await db.batch.findFirst({
        where: {
          currentAcademicYear: true,
          branchId,
        },
        select: {
          id: true,
          name: true,
        },
      })
    : null;

  // Get staff details if applicable
  let staffId = null;
  if (dbUser.role === 'TeachingStaff') {
    const dbStaff = await db.staff.findFirst({
      where: {
        email: dbUser.email,
      },
    });
    staffId = dbStaff?.id || null;
  }

  const organizationName =
    dbUser.userOrganizations[0]?.organization?.name ||
    dbUser.userOrganizations[0]?.branch?.name ||
    'Rexdeia Academy';
  const academicYear = academicDetails?.name || '2024-2025';

  // Create token payload matching your session data
  const tokenPayload = {
    // User specific data
    sub: dbUser.id, // JWT standard for user ID
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    picture: dbUser.image,
    username: dbUser.username,
    role: dbUser.role,
    staffId: staffId,

    // Organization related data
    branchId: dbUser.userOrganizations[0]?.branchId,
    organizationId: dbUser.userOrganizations[0]?.organizationId,
    organizationName,
    academicYear,
    currentBatch: academicDetails?.id,

    // Additional data
    createdBranches: dbUser.createdBranches,
  };

  // Create access token (short-lived)
  const accessToken = await new SignJWT(tokenPayload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('2h') // Short lived
    .sign(secret);

  // Create refresh token (long-lived)
  const refreshToken = await new SignJWT({
    sub: dbUser.id,
    type: 'refresh',
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  return {
    accessToken,
    refreshToken,
    user: tokenPayload,
  };
}

// Verify token and return same data structure as session
export async function verifyToken(token: string) {
  try {
    const secret = await generateSecretKey();

    const { payload } = await jwtVerify(token, secret, {
      issuer: 'urn:example:issuer',
      audience: 'urn:example:audience',
    });

    // Return in the same structure as your session
    return {
      user: {
        id: payload.id as string,
        name: payload.name as string,
        email: payload.email as string,
        image: payload.picture as string,
        username: payload.username as string,
        role: payload.role as string,
        staffId: payload.staffId as string | null,
        createdBranches: payload.createdBranches as any[],
        organizationName: (payload.organizationName as string) || 'Rexdeia Academy',
        academicYear: (payload.academicYear as string) || '2024-2025',
      },
      branchId: payload.branchId as string,
      organizationId: payload.organizationId as string,
      currentBatch: payload.currentBatch as string,
      organizationName: (payload.organizationName as string) || 'Rexdeia Academy',
      academicYear: (payload.academicYear as string) || '2024-2025',
    };
  } catch (error) {
    throw new Error('Invalid token', error);
  }
}

// Login function for mobile
export async function mobileLogin(credentials: {
  email: string;
  password: string;
}) {
  if (!credentials.email || !credentials.password) {
    throw new Error('EMAIL_PASSWORD_NOT_PROVIDED');
  }

  const user = await db.user.findUnique({
    where: {
      email: credentials.email,
    },
  });

  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  const passwordMatch = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error('INVALID_PASSWORD');
  }

  return createAuthTokens(user);
}

// Unified auth getter: Checks Bearer JWT first (mobile/API clients), falls back to NextAuth session (web)
export async function getAuthSession(req?: Request | NextRequest | null) {
  if (req) {
    const authHeader =
      req.headers.get('authorization') || req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      if (token) {
        try {
          const verified = await verifyToken(token);
          if (verified && (verified as any).user?.id) {
            return verified as any;
          }
        } catch {
          // If bearer token verification fails, return null
          return null;
        }
      }
    }
  }

  const session = await getServerSession(authOptions);
  return session;
}
