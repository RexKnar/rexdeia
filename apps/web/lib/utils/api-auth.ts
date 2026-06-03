import 'server-only';

import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Session } from 'types/auth';

type SessionGuardResult =
  | { session: Session; response: null }
  | { session: null; response: NextResponse };

// Requires an authenticated web (cookie) session for an API route.
// Usage:
//   const { session, response } = await requireSession();
//   if (response) return response;
export async function requireSession(): Promise<SessionGuardResult> {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    return {
      session: null,
      response: new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
        status: StatusCodes.UNAUTHORIZED,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }

  return { session, response: null };
}
