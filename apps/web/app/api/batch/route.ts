import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import {
  addBatch,
  getAllBatches,
  getAllBatchesWithFilter,
} from './[id]/service';

/**
 * @swagger
 * /api/batch:
 *     post:
 *       summary: Add new Batch
 *       description: Add New Batch
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Batch details added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your class object here
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
  const payload = await request.json();

  try {
    const batch = await addBatch(payload);
    return new NextResponse(JSON.stringify(batch), {
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
 * /api/batch:
 *     get:
 *       summary: Get All Batches
 *       description: Get All Batches
 *       responses:
 *         '200':
 *           description: Batch details are s fetcheduccessfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your class object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get('limit')) || 10;

    const paginatedBatchList = await getAllBatches(page, limit);
    return new NextResponse(JSON.stringify(paginatedBatchList), {
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
 * /api/batch:
 *     put:
 *       summary: Get All batches with Filter
 *       description: Get All batches with Filter
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
 *                 # Define the schema of your Batch object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const filter = await request.json();
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get('limit')) || 10;

    const paginatedBatchList = await getAllBatchesWithFilter(
      page,
      limit,
      filter
    );
    return new NextResponse(JSON.stringify(paginatedBatchList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
