import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { StatusCodes } from 'http-status-codes';
import { validateAddStaff } from './validator';
import { addStaff, getStaffList } from './service';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const payload = await request.json();

  try {
    await validateAddStaff(payload);

    const addedStaff = await addStaff(payload);
    return new NextResponse(JSON.stringify(addedStaff), {
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

    const paginatedStaffResult = await getStaffList(page, pageSize);
    return new NextResponse(JSON.stringify(paginatedStaffResult), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
