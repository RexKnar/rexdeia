import { StatusCodes } from 'http-status-codes';
import { getAuthSession } from 'lib/mobile-auth';
import { registerDeviceToken, unregisterDeviceToken } from 'lib/services/notification.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const body = await req.json();
    const { token, platform = 'ANDROID', deviceInfo } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'TOKEN_REQUIRED' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const deviceToken = await registerDeviceToken({
      userId: session.userId,
      token,
      platform,
      deviceInfo,
    });

    return NextResponse.json({ success: true, deviceToken });
  } catch (error: any) {
    console.error('[Mobile API /api/mobile/v1/notifications/tokens POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'INTERNAL_SERVER_ERROR' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'TOKEN_REQUIRED' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    await unregisterDeviceToken(token);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Mobile API /api/mobile/v1/notifications/tokens DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'INTERNAL_SERVER_ERROR' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
