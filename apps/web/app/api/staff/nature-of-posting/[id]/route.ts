import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  deleteNatureOfPostingById,
  getNatureOfPostingById,
  updateNatureOfPostingById,
} from '../service';

/**
 * @swagger
 * /api/staff/nature-of-posting/{id}:
 *     put:
 *       summary: Update natureOfPosting By Id
 *       description: Updates the details of an existing natureOfPosting.
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the natureOfPosting.
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
 *           description: natureOfPosting details updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your natureOfPosting object here
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

    const natureOfPosting = await updateNatureOfPostingById(id, payload);

    return new NextResponse(JSON.stringify(natureOfPosting), {
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
 * /api/staff/nature-of-posting/{id}:
 *     delete:
 *       summary: Delete natureOfPosting by Id
 *       description: Delete natureOfPosting by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the section.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: natureOfPosting details deleted successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your natureOfPosting object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function DELETE(_: NextRequest, { params: { id } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const natureOfPosting = await getNatureOfPostingById(id);

    if (natureOfPosting) {
      await deleteNatureOfPostingById(id);
      return new Response(JSON.stringify({}), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'NATURE_OF_POSTING_NOT_FOUND' }),
        {
          status: StatusCodes.NOT_FOUND,
        }
      );
    }
  } catch (e) {
    captureException(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
