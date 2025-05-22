import { mobileLogin } from 'lib/mobile-auth';
import { NextRequest, NextResponse } from 'next/server';

// async function generateSecretKey() {
//   // eslint-disable-next-line turbo/no-undeclared-env-vars
//   const secret = process.env.JWT_SECRET;
//   if (!secret) {
//     throw new Error('JWT_SECRET is not defined in environment variables');
//   }
//   return new TextEncoder().encode(secret);
// }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const authResult = await mobileLogin({ email, password });

    return NextResponse.json(authResult);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// export async function verifyToken(token: string) {
//   try {
//     const secret = await generateSecretKey();

//     const { payload, protectedHeader } = await jwtVerify(token, secret, {
//       issuer: 'urn:rexdeia:issuer',
//       audience: 'urn:rexdeia:audience',
//     });

//     return { valid: true, data: payload, headers: protectedHeader };
//   } catch (error) {
//     if (error instanceof errors.JWTExpired) {
//       return { valid: false, error: 'Token has expired' };
//     }
//     if (error instanceof errors.JWTClaimValidationFailed) {
//       return { valid: false, error: 'Token validation failed' };
//     }
//     return { valid: false, error: 'Invalid token' };
//   }
// }

// export async function refreshAccessToken(refreshToken: string) {
//   try {
//     const secret = await generateSecretKey();

//     const { payload } = await jwtVerify(refreshToken, secret);

//     if (payload.type !== 'refresh') {
//       throw new Error('Invalid token type');
//     }

//     const newAccessToken = await new SignJWT({
//       sub: payload.sub,
//     })
//       .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
//       .setIssuedAt()
//       .setIssuer('urn:rexdeia:issuer')
//       .setAudience('urn:rexdeia:audience')
//       .setExpirationTime('2h')
//       .sign(secret);

//     return { accessToken: newAccessToken };
//   } catch (error) {
//     throw new Error('Invalid refresh token', error);
//   }
// }
