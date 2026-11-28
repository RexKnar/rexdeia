import { StatusCodes } from 'http-status-codes';
import { getAuthSession } from 'lib/mobile-auth';
import { getUserNotifications, markNotificationsAsRead } from 'lib/services/notification.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const result = await getUserNotifications({
      userId: session.userId,
      page,
      limit,
      unreadOnly,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('[Mobile API /api/mobile/v1/notifications GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'INTERNAL_SERVER_ERROR' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { recipientIds, notificationIds } = body;

    await markNotificationsAsRead({
      userId: session.userId,
      recipientIds,
      notificationIds,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Mobile API /api/mobile/v1/notifications PUT] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'INTERNAL_SERVER_ERROR' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
