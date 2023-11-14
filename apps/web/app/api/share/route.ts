import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { validateCreateShare } from './[id]/validator';
import { createShare } from './[id]/service';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }
  try {
    await validateCreateShare(payload);
    const createdShare = await createShare(payload);
    return new NextResponse(JSON.stringify(createdShare), {
      status: 201,
    });
  } catch (e) {
    return new NextResponse(
      JSON.stringify({
        code: e.message,
        message: e.message,
      }),
      {
        status: 400,
      }
    );
  }
}
