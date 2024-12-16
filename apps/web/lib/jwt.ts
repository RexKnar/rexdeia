import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'rexdeia'); // Use environment variables
const alg = 'HS256';

interface TokenPayload extends JWTPayload {
  username: string;
}

/**
 * Create a JWT.
 * @param payload - The data to encode in the JWT.
 * @returns The signed JWT.
 */
export async function createJWT(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('2h') // Token expiration
    .sign(secret);
}

/**
 * Verify a JWT.
 * @param token - The JWT to verify.
 * @returns The decoded payload.
 */
export async function verifyJWT(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as TokenPayload;
}
