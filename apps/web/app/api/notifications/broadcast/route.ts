import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import {
  createAndDispatchNotification,
  NotificationPriority,
  NotificationType,
  TargetRole,
} from 'lib/services/notification.service';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_MANAGEMENT_ROLES = [
  'Admin',
  'OfficeAdmin',
  'HM',
  'AHM',
  'TeachingStaff', // In some institutions, department heads / teachers can broadcast to classes
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const userRole = session.user.role;
    if (!ALLOWED_MANAGEMENT_ROLES.includes(userRole)) {
      return NextResponse.json(
        { error: 'FORBIDDEN_INSUFFICIENT_PERMISSIONS' },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    const body = await req.json();
    const {
      title,
      body: messageBody,
      type = 'ANNOUNCEMENT',
      priority = 'NORMAL',
      targetRole = 'ALL',
      classId,
      sectionId,
      data = {},
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'TITLE_REQUIRED' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (!messageBody || !messageBody.trim()) {
      return NextResponse.json(
        { error: 'MESSAGE_BODY_REQUIRED' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const branchId = session.branchId;
    if (!branchId) {
      return NextResponse.json(
        { error: 'BRANCH_ID_REQUIRED_IN_SESSION' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const result = await createAndDispatchNotification({
      title: title.trim(),
      body: messageBody.trim(),
      type: type as NotificationType,
      priority: priority as NotificationPriority,
      targetRole: targetRole as TargetRole,
      branchId,
      organizationId: session.organizationId,
      classId: classId || undefined,
      sectionId: sectionId || undefined,
      data,
      createdById: session.user.id,
    });

    return NextResponse.json({
      success: true,
      notification: result.notification,
      recipientCount: result.recipientCount,
      pushResults: result.pushResults,
    });
  } catch (error: any) {
    console.error('[API /api/notifications/broadcast POST] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'INTERNAL_SERVER_ERROR' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * GET: Retrieve list of past broadcasts/announcements sent in this branch
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const branchId = session.branchId;
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const [announcements, totalCount] = await Promise.all([
      db.notification.findMany({
        where: {
          branchId,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              recipients: true,
            },
          },
        },
      }),
      db.notification.count({
        where: { branchId },
      }),
    ]);

    return NextResponse.json({
      items: announcements,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error: any) {
    console.error('[API /api/notifications/broadcast GET] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'INTERNAL_SERVER_ERROR' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
