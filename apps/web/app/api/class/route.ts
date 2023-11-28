import { NextRequest, NextResponse } from 'next/server';
import { addClass, getClassList } from './service';
import { StatusCodes } from 'http-status-codes';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const classListResponse = await getClassList();
    return new NextResponse(JSON.stringify(classListResponse), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const payload = await request.json();
  try {
    const createdClass = await addClass(payload);
    return new NextResponse(JSON.stringify(createdClass), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
