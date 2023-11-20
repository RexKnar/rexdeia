import { NextRequest, NextResponse } from 'next/server';

import { addAdmission, getAdmissionsList } from './service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }

  try {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const pageSize =
      parseInt(request.nextUrl.searchParams.get('pageSize')) || 10;

    const paginatedAdmissionResult = await getAdmissionsList(page, pageSize);
    return new NextResponse(JSON.stringify(paginatedAdmissionResult), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }

  const payload = await request.json();

  try {
    const admission = await addAdmission(payload);
    return new NextResponse(JSON.stringify(admission), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: 400,
    });
  }
}
