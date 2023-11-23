import { NextRequest, NextResponse } from 'next/server';

import { addStudent, getStudentsList } from './service';
import { validateAddUser } from './validator';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { StatusCodes } from 'http-status-codes';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const payload = await request.json();

  try {
    await validateAddUser(payload);

    const admission = await addStudent(payload);
    return new NextResponse(JSON.stringify(admission), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get('pageSize')) || 10;

    const paginatedStudentResult = await getStudentsList(page, pageSize);
    return new NextResponse(JSON.stringify(paginatedStudentResult), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
