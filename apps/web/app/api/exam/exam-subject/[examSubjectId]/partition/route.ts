import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { createExamSubjectPartition } from '../../service';

export async function POST(
  request: NextRequest,
  { params: { examSubjectId } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new NextResponse(
      JSON.stringify({
        error: 'VALIDATION_ERROR',
        message: 'Invalid JSON request body.',
      }),
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    const createdPartition = await createExamSubjectPartition(
      examSubjectId,
      payload as any,
      session.branchId
    );

    return new NextResponse(JSON.stringify(createdPartition), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    if (e?.message === 'VALIDATION_ERROR') {
      return new NextResponse(
        JSON.stringify({
          error: 'VALIDATION_ERROR',
          message: 'Invalid partition configuration data.',
        }),
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (
      e?.message === 'DATA_NOT_FOUND' ||
      e?.message === 'ASSESSMENT_FORMAT_NOT_FOUND'
    ) {
      return new NextResponse(
        JSON.stringify({
          error: e.message,
          message: 'Exam subject or assessment format not found.',
        }),
        { status: StatusCodes.NOT_FOUND }
      );
    }

    if (e?.message === 'PARTITION_ALREADY_EXISTS') {
      return new NextResponse(
        JSON.stringify({
          error: 'PARTITION_ALREADY_EXISTS',
          message: 'This partition is already enabled for this subject.',
        }),
        { status: StatusCodes.CONFLICT }
      );
    }

    captureException(e);
    return new NextResponse(JSON.stringify({ error: e?.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
