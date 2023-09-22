import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { updateOrganizationById } from './service';
import { validateUpdateOrganizationDetails } from './validator';

export async function PUT(request: Request, route: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }

  try {
    const payload = await request.json();
    const organizationId = route.params.id;

    await validateUpdateOrganizationDetails(payload);

    const organization = await updateOrganizationById(organizationId, payload);

    return new NextResponse(JSON.stringify(organization), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: e.message === 'VALIDATION_ERROR' ? 400 : 500,
    });
  }
}
