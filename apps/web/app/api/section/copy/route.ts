import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { copySections } from './service';

/**
 * @swagger
 * /api/section/copy:
 *     post:
 *       summary: Copy Sections
 *       description: Copy Sections from previous academic year
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Section details copied successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your section object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();
    const copiedSections = await copySections(payload);

    return new NextResponse(JSON.stringify(copiedSections), {
      status: StatusCodes.CREATED,
    });
  } catch (e: any) {
    captureException(e);
    return new NextResponse(
      JSON.stringify({ error: e.message || 'Something went wrong' }),
      {
        status: StatusCodes.BAD_REQUEST,
      }
    );
  }
}
