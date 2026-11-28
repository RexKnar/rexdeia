import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { getUserNotifications } from 'lib/services/notification.service';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const result = await getUserNotifications({
      userId: session.user.id,
      page,
      limit,
      unreadOnly,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API /api/notifications] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'INTERNAL_SERVER_ERROR' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
