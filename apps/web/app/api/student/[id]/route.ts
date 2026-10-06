import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import {
  deleteStudentById,
  getStudentById,
  updateStudentById,
} from '../service';

/**
 * @swagger
 * /api/student/{id}:
 *     get:
 *       summary: Get student by Id
 *       description: Get student by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the section.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Student details fetched successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your student object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function GET(request: NextRequest, { params: { id } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const student = await getStudentById(id);

    if (student) {
      return new Response(JSON.stringify(student), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(JSON.stringify({ error: 'STUDENT_NOT_FOUND' }), {
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

/**
 * @swagger
 * /api/student/{id}:
 *     delete:
 *       summary: Delete student by Id
 *       description: Delete student by Id
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: Unique identifier of the section.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Student details deleted successfully.
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
export async function DELETE(_: NextRequest, { params: { id } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const student = await getStudentById(id);

    if (student) {
      await deleteStudentById(id);
      return new Response(JSON.stringify({}), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(JSON.stringify({ error: 'STUDENT_NOT_FOUND' }), {
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

export async function PUT(request: Request, { params: { id } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.branchId || !session.organizationId) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const { resolveUserSecurityContext } = await import('lib/auth/scope-resolver');
  const security = await resolveUserSecurityContext(session);

  // 1. Staff check: Regular teaching staff cannot edit student details!
  if (!security.canEditStudents && !security.isBranchWide) {
    return new NextResponse(
      JSON.stringify({
        error: 'FORBIDDEN',
        message: 'Teaching staff are not permitted to edit student details.',
      }),
      { status: StatusCodes.FORBIDDEN }
    );
  }

  const payload = await request.json();

  try {
    const student = await getStudentById(id);

    if (!student) {
      return new Response(JSON.stringify({ error: 'STUDENT_NOT_FOUND' }), {
        status: StatusCodes.NOT_FOUND,
      });
    }

    // 2. Resource Boundary check: verify student belongs to teacher's section or AHM's class level
    if (!security.isBranchWide) {
      const studentSectionId = student.section?.id;
      const studentClassLevelId = student.class?.classLevelId;

      if (!security.isStudentEditable(studentSectionId, studentClassLevelId)) {
        return new NextResponse(
          JSON.stringify({
            error: 'FORBIDDEN',
            message:
              'You are only authorized to edit students in your assigned class or section.',
          }),
          { status: StatusCodes.FORBIDDEN }
        );
      }
    }

    const updatedStudent = await updateStudentById(id, payload);
    if (updatedStudent) {
      return new Response(JSON.stringify(updatedStudent), {
        status: StatusCodes.OK,
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'STUDENT_UPDATION_FAILED' }),
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        }
      );
    }
  } catch (e: any) {
    captureException(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
