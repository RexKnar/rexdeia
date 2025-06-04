import { captureException } from '@sentry/nextjs';
import { getOrganisationsByUserId } from 'app/api/user/organization/service';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await request.json();
    const userOrganizations = await getOrganisationsByUserId(session.user.id);
    const { branchId, organizationId } = userOrganizations[0];
    const organizationName = userOrganizations[0].organization.name;
    const institute = userOrganizations[0].organization.institute;

    // Build the new session update object
    const updatedSessionData = {
      ...session, // Preserve old session fields
      branchId, // Add/override with new fields
      organizationId,
      institute,
      organizationName,
      currentBatch: payload.currentBatch,
    };

    // Trigger token update logic
    const updatedToken = await authOptions.callbacks?.jwt?.({
      token: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        currentBatch: payload.currentBatch,
        ...session,
      },
      user: session.user,
      session: updatedSessionData,
      trigger: 'update',
    } as any);

    return new NextResponse(JSON.stringify(updatedToken), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
