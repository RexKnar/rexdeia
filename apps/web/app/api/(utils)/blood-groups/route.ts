import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

import { bloodGroups } from './data';

/**
 * @swagger
 * /api/blood-groups:
 *     get:
 *       summary: Retrieve blood groups list
 *       description: Gets a list of all blood group.
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of blood group.
 */
export async function GET() {
  try {
    return new Response(JSON.stringify(bloodGroups), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
