import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { validateUpdateShare } from './validator';
import { getShareById, updateShareById } from './service';

export async function GET(request: Request, route: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }
  try {
    const share = await getShareById(route.params.id);

    if (share) {
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
