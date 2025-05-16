import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { deleteCourseFAQById, updateCourseFAQById } from './service';

/**
 * @swagger
 * /api/institute/course/{courseId}/faq/{faqId}:
 *   put:
 *     summary: Update a course FAQ by ID
 *     description: Update a course FAQ question and answer by its ID
 *     parameters:
 *       - in: path
 *         name: faqId
 *         required: true
 *         description: The ID of the FAQ to update
 *         schema:
 *           type: string
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
 *       '200':
 *         description: FAQ updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 question:
 *                   type: string
 *                 answer:
 *                   type: string
 *       '400':
 *         description: Bad request due to validation error
 *       '401':
 *         description: Unauthorized access
 *       '404':
 *         description: FAQ not found
 *       '500':
 *         description: Internal server error
 */

export async function PUT(request: Request, { params: { faqId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  const { question, answer } = await request.json();
  if (!question || !answer) {
    return new NextResponse(
      JSON.stringify({ error: 'QUESTION AND ANSWER ARE REQUIRED' }),
      {
        status: StatusCodes.BAD_REQUEST,
      }
    );
  }
  try {
    const updatedFAQ = await updateCourseFAQById(faqId, { question, answer });
    if (!updatedFAQ) {
      return new NextResponse(JSON.stringify({ error: 'FAQ_NOT_FOUND' }), {
        status: StatusCodes.NOT_FOUND,
      });
    }
    return new NextResponse(JSON.stringify(updatedFAQ), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status:
        e.message === 'UPDATE_FAILED'
          ? StatusCodes.INTERNAL_SERVER_ERROR
          : StatusCodes.BAD_REQUEST,
    });
  }
}

/**
 * @swagger
 * /api/institute/course/{courseId}/faq/{faqId}:
 *   delete:
 *     summary: Delete a course FAQ by ID
 *     description: Delete a course FAQ by its ID
 *     parameters:
 *       - in: path
 *         name: faqId
 *         required: true
 *         description: The ID of the FAQ to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: FAQ deleted successfully
 *       '400':
 *         description: Bad request due to validation error
 *       '401':
 *         description: Unauthorized access
 *       '404':
 *         description: FAQ not found
 *       '500':
 *         description: Internal server error
 */

export async function DELETE(request: Request, { params: { faqId } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }
  try {
    const deletedFAQ = await deleteCourseFAQById(faqId);
    if (!deletedFAQ) {
      return new NextResponse(JSON.stringify({ error: 'FAQ_NOT_FOUND' }), {
        status: StatusCodes.NOT_FOUND,
      });
    }
    return new NextResponse(
      JSON.stringify({ message: 'FAQ deleted successfully' }),
      {
        status: StatusCodes.OK,
      }
    );
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status:
        e.message === 'DELETE_FAILED'
          ? StatusCodes.INTERNAL_SERVER_ERROR
          : StatusCodes.BAD_REQUEST,
    });
  }
}
