import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { validateCreateShare } from './[id]/validator';
import { createShare } from './[id]/service';
import { StatusCodes } from 'http-status-codes';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    await validateCreateShare(payload);
    const createdShare = await createShare(payload);
    return new NextResponse(JSON.stringify(createdShare), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    return new NextResponse(
      JSON.stringify({
        code: e.message,
        message: e.message,
      }),
      {
        status: StatusCodes.BAD_REQUEST,
      }
    );
  }
}
