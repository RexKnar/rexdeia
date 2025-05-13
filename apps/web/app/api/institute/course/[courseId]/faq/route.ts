import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { addCourseFAQ, getCourseFAQ } from './service';

/**
 * @swagger
 * /api/institute/course/{courseId}/faq:
 *   post:
 *     summary: Add a new FAQ for the course
 *     description: Adds a new frequently asked question to the specified course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *     responses:
 *       '201':
 *         description: FAQ added successfully
 *       '400':
 *         description: Bad request due to missing fields
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
export async function POST(
  request: Request,
  { params: { courseId } }: { params: { courseId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const payload = await request.json();
  const { question, answer } = payload;

  if (!question || !answer) {
    return new NextResponse(
      JSON.stringify({ error: 'Question and answer are required!' }),
      {
        status: StatusCodes.BAD_REQUEST,
      }
    );
  }

  try {
    const faq = await addCourseFAQ(courseId, { question, answer });
    return new NextResponse(JSON.stringify(faq), {
      status: StatusCodes.CREATED,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * @swagger
 * /api/institute/course/{courseId}/faq:
 *   get:
 *     summary: Get FAQs for a course
 *     description: Returns a list of FAQs related to the course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       '200':
 *         description: List of FAQs returned successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server error
 */
export async function GET(
  request: Request,
  { params: { courseId } }: { params: { courseId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const faqs = await getCourseFAQ(courseId);
    return new NextResponse(JSON.stringify(faqs), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch FAQs' }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
