import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authenticate } from 'lib/middlewares/authMiddleware';
import { NextRequest, NextResponse } from 'next/server';

import { addClass, getAllClassesWithFilter, getClassList } from './service';

/**
 * @swagger
 * /api/mobile/v1/class:
 *     get:
 *       summary: Retrieve class list
 *       description: Gets a list of all classes.
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of classes.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   # Define the schema for a single class here
 */
export async function GET(request: NextRequest) {
  const { data: session, error, isAuthenticated } = await authenticate(request);

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED', details: error },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get('limit')) || 10;

    const classList = await getClassList(session, page, limit);
    return new NextResponse(JSON.stringify(classList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

/**
 * @swagger
 *   /api/mobile/v1/class:
 *     post:
 *       summary: Add a new class
 *       description: Creates a new class with the provided details.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of classes.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   # Define the schema for a single class here
 *         '401':
 *           description: Unauthorized access.
 *         '400':
 *           description: Bad request due to an error in processing the request.
 */
export async function POST(request: NextRequest) {
  const { data: session, error, isAuthenticated } = await authenticate(request);

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED', details: error },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  const payload = await request.json();
  try {
    const createdClass = await addClass(session, payload);
    return new NextResponse(JSON.stringify(createdClass), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

/**
 * @swagger
 * /api/mobile/v1/class:
 *     put:
 *       summary: Get All Classes with Filter
 *       description: Get All Classes with Filter
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Data Found.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Class object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function PUT(request: NextRequest) {
  const { data: session, error, isAuthenticated } = await authenticate(request);

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED', details: error },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  try {
    const filter = await request.json();
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get('limit')) || 10;

    const paginatedClassesList = await getAllClassesWithFilter(
      session,
      page,
      limit,
      filter
    );
    return new NextResponse(JSON.stringify(paginatedClassesList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
