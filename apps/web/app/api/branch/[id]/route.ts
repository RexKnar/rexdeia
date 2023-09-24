import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { updateBranchById } from './service';
import { validateUpdateBranchDetails } from './validator';

export async function PUT(request: Request, route: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }

  try {
    const payload = await request.json();
    const branchId = route.params.id;

    await validateUpdateBranchDetails(payload);

    const branch = await updateBranchById(branchId, payload);

    return new NextResponse(JSON.stringify(branch), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: e.message === 'VALIDATION_ERROR' ? 400 : 500,
    });
  }
}
