import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { resolveUserSecurityContext } from 'lib/auth/scope-resolver';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { enterMark } from './service';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const payload = await request.json();

  try {
    const security = await resolveUserSecurityContext(session);

    // If not branch-wide (admin/BM/HM), verify section/subject authorization
    if (!security.isBranchWide && payload.sectionId) {
      const isAllowed = security.isMarkEntryAllowed(
        payload.sectionId,
        payload.subjectId || null
      );

      if (!isAllowed) {
        return new NextResponse(
          JSON.stringify({
            error: 'FORBIDDEN',
            message:
              'You are not authorized to enter or modify marks for this section or subject.',
          }),
          { status: StatusCodes.FORBIDDEN }
        );
      }
    }

    // Enforce authenticated user's ID to prevent grader impersonation
    payload.userId = session.user.id;
    const createdMarkEntry = await enterMark(payload);
    return new NextResponse(JSON.stringify(createdMarkEntry), {
      status: StatusCodes.CREATED,
    });
  } catch (e: any) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
