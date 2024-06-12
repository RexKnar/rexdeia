import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  deleteDesignationById,
  getDesignationById,
  updateDesignationById,
} from '../service';

/**
 * @swagger
 * /api/staff/designation/{id}:
 *     put:
 *       summary: Update designation By Id
 *       description: Updates the details of an existing designation.
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the designation.
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
 *           description: designation details updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your designation object here
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

    const designation = await updateDesignationById(id, payload);

    return new NextResponse(JSON.stringify(designation), {
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
 * /api/staff/designation/{id}:
 *     delete:
 *       summary: Delete designation by Id
 *       description: Delete designation by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the section.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: designation details deleted successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your designation object here
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

    const designation = await getDesignationById(id);

    if (designation) {
      await deleteDesignationById(id);
      return new Response(JSON.stringify({}), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(JSON.stringify({ error: 'DESIGNATION_NOT_FOUND' }), {
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
