// src/lib/auth/mobile-auth.ts
import bcrypt from 'bcrypt';
import { jwtVerify, SignJWT } from 'jose';
import { nanoid } from 'nanoid';

import { db } from './db';

async function generateSecretKey() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return new TextEncoder().encode(secret);
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
      userOrganizations: true,
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
  const academicDetails = await db.batch.findFirst({
    where: {
      currentAcademicYear: true,
      branchId: dbUser.userOrganizations[0]?.branchId,
    },
  });

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
      },
      branchId: payload.branchId as string,
      organizationId: payload.organizationId as string,
      currentBatch: payload.currentBatch as string,
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
