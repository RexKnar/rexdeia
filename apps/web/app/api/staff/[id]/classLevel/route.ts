import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getAllClassLevelByStaffId } from './service';

/**
 * @swagger
 * /api/staff/{id}/classLevel:
 *     get:
 *       summary: Retrieve class Levels by staff id
 *       description: Gets a list of all class levels by staff id.
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of class levels.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   # Define the schema for a single class here
 */
export async function GET(_: NextRequest, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const classLevelList = await getAllClassLevelByStaffId(id);
    return new NextResponse(JSON.stringify(classLevelList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
