import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { deleteDayById, getDayById, updateDayById } from '../service';

/**
 * @swagger
 * /api/days/{id}:
 *     put:
 *       summary: Update day details
 *       description: Updates the details of an existing day.
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the day.
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
 *           description: day details updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your day object here
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

    const updatedDay = await updateDayById(id, payload);

    return new NextResponse(JSON.stringify(updatedDay), {
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
 * /api/days/{id}:
 *     get:
 *       summary: Get days by Id
 *       description: Get days by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the days.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: days details are fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your days object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function GET(request: Request, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const day = await getDayById(id);

    return new NextResponse(JSON.stringify(day), {
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
 * /api/days/{id}:
 *     delete:
 *       summary: Delete day by Id
 *       description: Delete day by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the section.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: days details deleted successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your day object here
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

    const day = await getDayById(id);

    if (day) {
      await deleteDayById(id);
      return new Response(JSON.stringify({}), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(JSON.stringify({ error: 'Day_NOT_FOUND' }), {
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
