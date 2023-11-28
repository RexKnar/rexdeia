import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { getShareById, updateShareById } from './service';
import { validateUpdateShare } from './validator';

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
    const share = await getShareById(route.params.id);

    if (share) {
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

export async function PUT(
  request: NextRequest,
  route: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }
  const payload = await request.json();
  try {
    await validateUpdateShare(route.params.id, payload);
    const updatedShare = await updateShareById(route.params.id, payload);
    return new NextResponse(JSON.stringify(updatedShare), {
      status: 200,
    });
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
