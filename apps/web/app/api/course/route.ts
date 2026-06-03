import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { requireSession } from 'lib/utils/api-auth';
import { NextRequest, NextResponse } from 'next/server';

import { addCourse, deletCourse } from './service';
import { validateAddCourse } from './validator';

export async function POST(request: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;

  const payload = await request.json();
  try {
    await validateAddCourse(payload);
    const createdCourse = await addCourse(payload);
    return new NextResponse(JSON.stringify(createdCourse), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

export async function DELETE(request: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;

  const payload = await request.json();
  try {
    const deleteResponse = await deletCourse(payload.courseId);
    return new NextResponse(JSON.stringify(deleteResponse), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
