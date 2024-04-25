import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import { getTermById, updateTermById } from '../service';

/**
 * @swagger
 * /api/exam/term/{id}:
 *     get:
 *       summary: Get Term by Id
 *       description: Get Term by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the Term.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Term details are fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Term object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function GET(_request: Request, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const term = await getTermById(id);

    return new NextResponse(JSON.stringify(term), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status:
        e.message === 'VALIDATION_ERROR'
          ? StatusCodes.BAD_REQUEST
          : StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * @swagger
 * /api/exam/term/{id}:
 *     put:
 *       summary: Update term By Id
 *       description: Updates the details of an existing term.
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the term.
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Term details updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your term object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function PUT(request: Request, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();

    const medium = await updateTermById(id, payload);

    return new NextResponse(JSON.stringify(medium), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status:
        e.message === 'VALIDATION_ERROR'
          ? StatusCodes.BAD_REQUEST
          : StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}