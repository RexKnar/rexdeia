import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  deleteStaffCategoryById,
  getStaffCategoryById,
  updateStaffCategoryById,
} from '../service';

/**
 * @swagger
 * /api/staff/staff-category/{id}:
 *     put:
 *       summary: Update staffCategory By Id
 *       description: Updates the details of an existing staffCategory.
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the staffCategory.
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
 *           description: staffCategory details updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your staffCategory object here
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

    const staffCategory = await updateStaffCategoryById(id, payload);

    return new NextResponse(JSON.stringify(staffCategory), {
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
 * /api/staff/staff-category/{id}:
 *     delete:
 *       summary: Delete staffCategory by Id
 *       description: Delete staffCategory by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the section.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: staffCategory details deleted successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your staffCategory object here
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

    const staffCategory = await getStaffCategoryById(id);

    if (staffCategory) {
      await deleteStaffCategoryById(id);
      return new Response(JSON.stringify({}), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'STAFF_CATEGORY_NOT_FOUND' }),
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
