import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getUserRoleHistory } from './service';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const history = await getUserRoleHistory(params.id);
    return new NextResponse(JSON.stringify(history), {
      status: StatusCodes.OK,
    });
  } catch (error: any) {
    captureException(error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
