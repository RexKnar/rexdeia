import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { onboardEntities } from './service';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { branchId, organizationId } = (await request.json()) as {
    branchId: string;
    organizationId: string;
  };

  if (!session || !branchId || !organizationId) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }

  try {
    await onboardEntities(branchId, organizationId);

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
