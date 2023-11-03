import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { NextResponse } from 'next/server';
import { getShareByFormId } from '../../../share/[id]/service';

export async function GET(request: Request, route: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }
  try {
    const share = await getShareByFormId(route.params.id);
    if (share && share.length != 0) {
      return new NextResponse(JSON.stringify(share), {
        status: 200,
      });
    } else {
      return new NextResponse(
        JSON.stringify({
          message: 'SHARE_NOT_FOUND',
        }),
        {
          status: 404,
        }
      );
    }
  } catch (e) {
    return new NextResponse(
      JSON.stringify({
        message: e.message,
      }),
      {
        status: 400,
      }
    );
  }
}
