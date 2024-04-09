import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { getSubjectsWithFormat } from '../service';

/**
 * @swagger
 * /api/mark-entry/subjects:
 *     put:
 *       summary: get subjects by exam&class&section
 *       description: get subjects by exam&class&section
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the exam&class&section optional
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
 *           description: Subjects fetched successfully.
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
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();

    const subjectsWithFormat = await getSubjectsWithFormat(payload);

    return new NextResponse(JSON.stringify(subjectsWithFormat), {
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
 * /api/mark-entry/subjects:
 *     post:
 *       summary: get Subject by class&Section&Staff
 *       description: get subjects by class&Section&Staff
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: Subjects fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your subjects object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
// export async function POST(request: Request) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
//       status: StatusCodes.UNAUTHORIZED,
//     });
//   }
//   const payload = await request.json();

//   try {
//     const subjectsByClassSectionStaff =
//       await getSubjectsByClassSectionStaff(payload);
//     return new NextResponse(JSON.stringify(subjectsByClassSectionStaff), {
//       status: StatusCodes.CREATED,
//     });
//   } catch (e) {
//     captureException(e);
//     return new NextResponse(e, {
//       status: StatusCodes.BAD_REQUEST,
//     });
//   }
// }
