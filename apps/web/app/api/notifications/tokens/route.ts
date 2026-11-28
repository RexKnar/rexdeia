import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { registerDeviceToken, unregisterDeviceToken } from 'lib/services/notification.service';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const body = await req.json();
    const { token, platform = 'WEB', deviceInfo } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'TOKEN_REQUIRED' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const deviceToken = await registerDeviceToken({
      userId: session.user.id,
      token,
      platform,
      deviceInfo,
    });

    return NextResponse.json({ success: true, deviceToken });
  } catch (error: any) {
    console.error('[API /api/notifications/tokens POST] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'INTERNAL_SERVER_ERROR' },
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
        { error: 'TOKEN_REQUIRED' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    await unregisterDeviceToken(token);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /api/notifications/tokens DELETE] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'INTERNAL_SERVER_ERROR' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
