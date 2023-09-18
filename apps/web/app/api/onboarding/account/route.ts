import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { initializeAccountForUserId } from './service';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }

  try {
    await initializeAccountForUserId(session.user.id);

    return new NextResponse(JSON.stringify({}), {
      status: 201,
    });
  } catch (e) {
    console.error(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: 500,
    });
  }
}
