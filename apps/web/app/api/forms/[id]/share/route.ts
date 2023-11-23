import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { NextResponse } from 'next/server';
import { getShareByFormId } from '../../../share/[id]/service';
import { StatusCodes } from 'http-status-codes';

export async function GET(
  _request: Request,
  route: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const share = await getShareByFormId(route.params.id);
    if (share && share.length != 0) {
      return new NextResponse(JSON.stringify(share), {
        status: StatusCodes.OK,
      });
    } else {
      return new NextResponse(
        JSON.stringify({
          message: 'SHARE_NOT_FOUND',
        }),
        {
          status: StatusCodes.NOT_FOUND,
        }
      );
    }
  } catch (e) {
    return new NextResponse(
      JSON.stringify({
        message: e.message,
      }),
      {
        status: StatusCodes.BAD_REQUEST,
      }
    );
  }
}
