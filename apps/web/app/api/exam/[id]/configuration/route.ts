import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import { createExamConfigurationForExam } from './service';

export async function POST(request: Request, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const payload = await request.json();

  try {
    const createdExam = await createExamConfigurationForExam(id, payload);
    return new NextResponse(JSON.stringify(createdExam), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
