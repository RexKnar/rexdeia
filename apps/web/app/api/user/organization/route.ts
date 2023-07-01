import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { getOrganisationsByUserId } from './service';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }

  try {
    const organizations = await getOrganisationsByUserId(session.user.id);
    return new NextResponse(JSON.stringify(organizations), {
      status: 200,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: 500,
    });
  }
}
