import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { getOrganisationsByUserId } from './service';
import { StatusCodes } from 'http-status-codes';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const organizations = await getOrganisationsByUserId(session.user.id);
    return new NextResponse(JSON.stringify(organizations), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
