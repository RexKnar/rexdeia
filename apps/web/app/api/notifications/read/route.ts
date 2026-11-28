import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import {
  markAllNotificationsAsRead,
  markNotificationsAsRead,
} from 'lib/services/notification.service';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { recipientIds, notificationIds, markAll = false } = body;

    if (markAll) {
      await markAllNotificationsAsRead(session.user.id);
      return NextResponse.json({ success: true, markedAll: true });
    }

    await markNotificationsAsRead({
      userId: session.user.id,
      recipientIds,
      notificationIds,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /api/notifications/read PUT] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'INTERNAL_SERVER_ERROR' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
