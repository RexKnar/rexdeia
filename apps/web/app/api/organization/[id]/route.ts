import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { getOrganizationById, updateOrganizationById } from './service';
import { validateUpdateOrganizationDetails } from './validator';

export async function PUT(request: Request, route: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();
    const organizationId = route.params.id;

    await validateUpdateOrganizationDetails(payload);

    const organization = await updateOrganizationById(organizationId, payload);

    return new NextResponse(JSON.stringify(organization), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    console.error(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status:
        e.message === 'VALIDATION_ERROR'
          ? StatusCodes.BAD_REQUEST
          : StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function GET(request: Request, route: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.organizationId !== route.params.id) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }
  const organization = await getOrganizationById(route.params.id);

  if (organization) {
    return new NextResponse(JSON.stringify(organization), {
      status: 200,
    });
  } else {
    return new NextResponse(
      JSON.stringify(`Organization ${route.params.id} not Found`),
      {
        status: 404,
      }
    );
  }
}
