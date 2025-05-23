import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  deleteModuleById,
  getModuleDetailById,
  updateCourseModule,
} from '../service';

/**
 * @swagger
 * /api/institute/course/{courseId}/module/{moduleId}:
 *   put:
 *     summary: Update a course module
 *     description: Update the details of a specific course module.
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Course module updated successfully.
 *       400:
 *         description: Bad request due to validation error.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
export async function PUT(request: Request, { params: { moduleId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const payload = await request.json();

  try {
    const updatedModule = await updateCourseModule(moduleId, payload);
    return new NextResponse(JSON.stringify(updatedModule), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update module', details: e.message }),
      { status: StatusCodes.BAD_REQUEST }
    );
  }
}

/**
 * @swagger
 * /api/institute/course/{courseId}/module/{moduleId}:
 *     get:
 *       summary: Get Course Module By Id
 *       description: Get the details of an Course Module By Id.
 *       parameters:
 *         - name: moduleId
 *           in: path
 *           required: true
 *           description: Unique identifier of the Course Module.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Course Module details fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your Course Module object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function GET(request: Request, { params: { moduleId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const courseModuleById = await getModuleDetailById(moduleId);

    return new NextResponse(JSON.stringify(courseModuleById), {
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
 * /api/institute/course/{courseId}/module/{moduleId}:
 *   delete:
 *     summary: Soft delete Course Module By Id
 *     description: Marks the Course Module as deleted (soft delete).
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: moduleId
 *         in: path
 *         required: true
 *         description: Unique identifier of the Course Module.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Course Module soft deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstituteCourseModuleModel'
 *       '401':
 *         description: Unauthorized access.
 *       '500':
 *         description: Internal server error.
 */

export async function DELETE(
  request: Request,
  { params }: { params: { moduleId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const deletedModule = await deleteModuleById(params.moduleId);

    return new NextResponse(JSON.stringify(deletedModule), {
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
