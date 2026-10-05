import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { db } from 'lib/db';
import { getAuthSession } from 'lib/mobile-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await getAuthSession(request);
  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const staff = await db.staff.findFirst({
      where: {
        OR: [
          { userId: session.user.id },
          { email: session.user.email },
        ],
      },
      select: { id: true, firstName: true, lastName: true },
    });

    const staffId = staff?.id;

    // Get today's substitutions for this staff member
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const substitutions = staffId
      ? await db.timetableSubstitution.findMany({
          where: {
            substituteStaffId: staffId,
            date: today,
          },
        })
      : [];

    const entryIds = substitutions.map((s) => s.entryId).filter(Boolean);
    const entries = entryIds.length
      ? await db.timetableEntry.findMany({
          where: { id: { in: entryIds } },
          include: {
            slot: true,
            section: { include: { class: true } },
            subject: true,
          },
        })
      : [];
    const entryMap = new Map(entries.map((e) => [e.id, e]));

    return NextResponse.json({
      staffId: staffId ?? null,
      substitutions: substitutions.map((s) => {
        const entry = entryMap.get(s.entryId);
        return {
          id: s.id,
          periodLabel: entry?.slot?.label || 'Period',
          className: entry?.section
            ? `${entry.section.class?.name || ''} - ${entry.section.name}`
            : '',
          subjectName: entry?.subject?.name || 'Class',
          room: entry?.slot?.session || 'Classroom',
          reason: s.reason || 'Substitution',
        };
      }),
    });
  } catch (e: any) {
    captureException(e);
    return NextResponse.json(
      { error: e.message || 'BAD_REQUEST' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
}
