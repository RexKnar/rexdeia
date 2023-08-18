import { NextRequest, NextResponse } from 'next/server';
import { validateAddOrganization } from './validator';
import { addOrganization } from './service';
import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }

  try {
    const payload = await request.json();
    await validateAddOrganization(payload);
    const createdUser = await addOrganization({
      ...payload,
      userId: session.user.id,
    });

    return new NextResponse(JSON.stringify(createdUser), {
      status: 201,
    });
  } catch (e) {
    console.error(`-------->${e}`);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: e.message === 'VALIDATION_ERROR' ? 400 : 500,
    });
  }
}
