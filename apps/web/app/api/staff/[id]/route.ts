import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { deleteStaffById, getStaffById, updateStaffById } from '../service';
import { validateUpdateStaff } from '../schemas';

export async function GET(_: NextRequest, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }

  try {
    const staff = await getStaffById(id);

    if (staff) {
      return new Response(JSON.stringify(staff), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(JSON.stringify({ error: 'STAFF_NOT_FOUND' }), {
        status: StatusCodes.NOT_FOUND,
      });
    }
  } catch (e) {
    captureException(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function PUT(request: Request, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }
  const payload = await request.json();
  try {
    await validateUpdateStaff(payload);
    const staff = await getStaffById(id);

    if (staff) {
      const updatedStaff = await updateStaffById(id, payload);
      if (updatedStaff) {
        return new Response(JSON.stringify(updatedStaff), {
          status: StatusCodes.OK,
        });
      } else {
        return new Response(
          JSON.stringify({ error: 'STAFF_UPDATION_FAILED' }),
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
          }
        );
      }
    } else {
      return new Response(JSON.stringify({ error: 'STAFF_NOT_FOUND' }), {
        status: StatusCodes.NOT_FOUND,
      });
    }
  } catch (e) {
    captureException(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function DELETE(_: Request, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }
  try {
    const staff = await getStaffById(id);

    if (staff) {
      const deletedStaff = await deleteStaffById(id);
      if (deletedStaff) {
        return new Response(JSON.stringify(deletedStaff), {
          status: StatusCodes.OK,
        });
      } else {
        return new Response(
          JSON.stringify({ error: 'STAFF_DELETION_FAILED' }),
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
          }
        );
      }
    } else {
      return new Response(JSON.stringify({ error: 'STAFF_NOT_FOUND' }), {
        status: StatusCodes.NOT_FOUND,
      });
    }
  } catch (e) {
    captureException(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
