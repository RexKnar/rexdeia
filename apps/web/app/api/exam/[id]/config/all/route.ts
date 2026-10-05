import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { getAuthSession } from 'lib/mobile-auth';
import { db } from 'lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const session = await getAuthSession(request);
  const branchId = session?.branchId || session?.user?.branchId;
  if (!session || !branchId) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const exam = await db.exam.findFirst({
      where: {
        id,
        branchId: branchId,
        isDeleted: false,
      },
      select: { id: true },
    });

    if (!exam) {
      return new NextResponse(JSON.stringify({ error: 'Exam not found' }), {
        status: StatusCodes.NOT_FOUND,
      });
    }

    const response = await db.examGroup.findMany({
      where: {
        examId: id,
        examSubject: {
          some: {},
        },
      },
      select: {
        id: true,
        sectionId: true,
        section: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        examSubject: {
          select: {
            id: true,
            subjectId: true,
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
            convertTo: true,
            minMark: true,
            totalMarks: true,
            examSubjectPartition: {
              include: {
                assessmentFormat: true,
              },
            },
          },
        },
      },
    });

    const responseData = response.flatMap((group) =>
      group.examSubject.map((subject) => ({
        subjectId: subject.subject?.id,
        examSubjectId: subject.id,
        subjectName: subject.subject?.name,
        convertTo: subject.convertTo,
        minMark: subject.minMark,
        totalMarks: subject.totalMarks,
        section: {
          id: group.section?.id,
          name: group.section?.name,
        },
        class: {
          id: group.class?.id,
          name: group.class?.name,
        },
        examSubjectPartition: subject.examSubjectPartition,
      }))
    );

    return new NextResponse(JSON.stringify(responseData), {
      status: StatusCodes.OK,
    });
  } catch (e: any) {
    captureException(e);
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
