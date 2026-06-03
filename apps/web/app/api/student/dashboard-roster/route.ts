import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  DashboardRosterScope,
  getStudentRosterForDashboard,
} from '../service';

const VALID_SCOPES: DashboardRosterScope[] = [
  'active',
  'discontinued',
  'newAdmissions',
];

/**
 * GET /api/student/dashboard-roster
 * Returns the filtered student roster for the selected academic year, used by
 * the dashboard drill-down dialog.
 *
 * Query params: scope (active|discontinued|newAdmissions), mediumId?, classId?
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const scope = (searchParams.get('scope') ??
      'active') as DashboardRosterScope;

    if (!VALID_SCOPES.includes(scope)) {
      return new NextResponse(JSON.stringify({ error: 'INVALID_SCOPE' }), {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const rows = await getStudentRosterForDashboard({
      scope,
      mediumId: searchParams.get('mediumId') ?? undefined,
      classId: searchParams.get('classId') ?? undefined,
    });

    return NextResponse.json(rows, { status: StatusCodes.OK });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'BAD_REQUEST' }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
