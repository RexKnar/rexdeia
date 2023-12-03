import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import { getShareByFormId } from '../../../share/[id]/service';

/**
 *   @swagger
 *   /api/forms/{id}/share:
 *     get:
 *       summary: Get share information
 *       description: Retrieves share information for a given form ID.
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the form.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of enquiries.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 * @param _request
 * @param route
 * @constructor
 */
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
    captureException(e);
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
