import { captureException } from '@sentry/nextjs';
import { getOrganisationsByUserId } from 'app/api/user/organization/service';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAllBatchesWithFilter } from 'app/api/batch/[id]/service';
import { encode } from 'next-auth/jwt';

export async function PUT() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userOrganizations = await getOrganisationsByUserId(session.user.id);
    console.log('session details from mobile', userOrganizations);

    const { branchId, organizationId } = userOrganizations[0];
    const organizationName = userOrganizations[0].organization.name;
    const institute = userOrganizations[0].organization.institute;
    const currentBatch = await getAllBatchesWithFilter(
      1,
      1,
      { isActive: true }
    );
    if (organizationId) {
      // Get academic details (matching your session logic)
      const academicDetails = await db.batch.findFirst({
        where: {
          currentAcademicYear: true,
          branchId: branchId,
        },
      });

      console.log(currentBatch, academicDetails);

      // Build the new session update object
      const updatedSessionData = {
        ...session, // Preserve old session fields
        branchId, // Add/override with new fields
        organizationId,
        institute,
        organizationName,
        currentBatch: academicDetails?.id,
      };

      // Trigger token update logic
      const updatedToken = await authOptions.callbacks?.jwt?.({
        token: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          ...session, // Preserve full session data
        },
        user: session.user,
        session: updatedSessionData,
        trigger: 'update',
      } as any); // You can define proper types if needed

      const encodedToken = await encode({
        token: updatedToken,
        secret: process.env.NEXTAUTH_SECRET!,
      });

      const cookieName = process.env.NEXTAUTH_URL?.startsWith('https://')
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token';

      const response = new NextResponse(JSON.stringify(updatedToken), {
        status: StatusCodes.OK,
      });

      response.cookies.set(cookieName, encodedToken, {
        httpOnly: true,
        secure: process.env.NEXTAUTH_URL?.startsWith('https://'),
        sameSite: 'lax',
        path: '/',
      });

      return response;
    }
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
