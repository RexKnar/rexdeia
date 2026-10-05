import { captureException } from '@sentry/nextjs';
import { getOrganisationsByUserId } from 'app/api/user/organization/service';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { createAuthTokens, getAuthSession } from 'lib/mobile-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession(request);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const userOrganizations = await getOrganisationsByUserId(session.user.id);
    const branchId = userOrganizations?.[0]?.branchId || session.branchId;
    const organizationName =
      userOrganizations?.[0]?.organization?.name ||
      userOrganizations?.[0]?.branch?.name ||
      (session as any).organizationName ||
      'Rexdeia Academy';

    const academicDetails = await db.batch.findFirst({
      where: {
        currentAcademicYear: true,
        ...(branchId ? { branchId } : {}),
      },
      select: {
        id: true,
        name: true,
      },
    });

    const academicYear = academicDetails?.name || '2024-2025';

    return NextResponse.json({
      success: true,
      organizationName,
      academicYear,
      user: {
        ...session.user,
        organizationName,
        academicYear,
      },
    });
  } catch (e: any) {
    captureException(e);
    return NextResponse.json(
      { error: e.message || 'FAILED_TO_GET_SESSION' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAuthSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userOrganizations = await getOrganisationsByUserId(session.user.id);
    if (!userOrganizations || userOrganizations.length === 0) {
      return NextResponse.json(
        { error: 'No organizations found for user' },
        { status: 404 }
      );
    }

    const { branchId, organizationId } = userOrganizations[0];
    const organizationName = userOrganizations[0].organization?.name;
    const institute = userOrganizations[0].organization?.institute;
    // Get academic details (matching your session logic)
    const academicDetails = await db.batch.findFirst({
      where: {
        currentAcademicYear: true,
        branchId: branchId,
      },
    });

    // If mobile Bearer token, regenerate and return mobile tokens
    const authHeader =
      request.headers.get('authorization') ||
      request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const dbUser = await db.user.findUnique({
        where: { id: session.user.id },
      });
      if (dbUser) {
        const tokens = await createAuthTokens(dbUser);
        return new NextResponse(JSON.stringify(tokens), {
          status: StatusCodes.OK,
        });
      }
    }

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
    } as any);

    return new NextResponse(JSON.stringify(updatedToken), {
      status: StatusCodes.OK,
    });
  } catch (e: any) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
