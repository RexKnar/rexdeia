import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import {
  deleteSubjectMasterById,
  getSubjectMasterById,
  updateSubjectMasterById,
} from '../service';
/**
 * @swagger
 * /api/subject-master/{id}:
 *     put:
 *       summary: update subject-master by Id
 *       description: update subject-master by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the subject-master.
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
 *           description: Subject-master details updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your subject-master object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function PUT(request: NextRequest, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();

    const updatedSubjectMaster = await updateSubjectMasterById(id, payload);

    return new NextResponse(JSON.stringify(updatedSubjectMaster), {
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
 * /api/subject-master/{id}:
 *     get:
 *       summary: Fetch subject-master By Id
 *       description: Fetch subject-master By Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the subject-master.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Subject-master details are fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your subject-master object here
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
    const subjectMasterById = await getSubjectMasterById(id);

    return new NextResponse(JSON.stringify(subjectMasterById), {
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
 * /api/subject-master/{id}:
 *     delete:
 *       summary: Delete subject-master by Id
 *       description: Delete subject-master by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the subject-master.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Subject-master details deleted successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your subject-master object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function DELETE(request: NextRequest, { params: { id } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const subjectMaster = await getSubjectMasterById(id);

    if (subjectMaster) {
      const subject = await deleteSubjectMasterById(id);
      return new Response(JSON.stringify(subject), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'SUBJECT_MASTER_NOT_FOUND' }),
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
