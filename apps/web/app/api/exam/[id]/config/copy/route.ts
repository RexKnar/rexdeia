import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

type CopyPartitionItem = {
  assessmentFormatId: string;
  minMark: number | string;
  totalMarks: number | string;
  convertTo: number | string;
  order?: number;
  dateToConduct?: string;
  excludeSubjectValidation?: boolean;
};

type CopyConfigItem = {
  classId: string;
  sectionId: string;
  subjectId: string;
  groupId?: string;
  totalMarks: number | string;
  convertTo: number | string;
  minMark: number | string;
  partitions: CopyPartitionItem[];
};

export async function POST(
  request: NextRequest,
  { params: { id: examId } }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.branchId) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  try {
    const payload = await request.json();
    const items: CopyConfigItem[] = payload?.items ?? [];

    if (!items.length) {
      return new NextResponse(
        JSON.stringify({ error: 'No items provided to copy' }),
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Verify exam exists
    const exam = await db.exam.findFirst({
      where: {
        id: examId,
        branchId: session.branchId,
        isDeleted: false,
      },
    });

    if (!exam) {
      return new NextResponse(JSON.stringify({ error: 'Exam not found' }), {
        status: StatusCodes.NOT_FOUND,
      });
    }

    let savedCount = 0;

    // Process each configuration item
    for (const item of items) {
      const { classId, sectionId, subjectId } = item;
      if (!classId || !sectionId || !subjectId) continue;

      // Ensure groupId is valid
      let groupId = item.groupId;
      if (!groupId) {
        const subToGroup = await db.subjectToGroup.findFirst({
          where: { subjectId, classId },
          select: { groupId: true },
        });
        groupId = subToGroup?.groupId;
      }

      if (!groupId) {
        // Fallback: look for section group
        const secToGroup = await db.sectionToGroups.findFirst({
          where: { sectionId },
          select: { groupId: true },
        });
        groupId = secToGroup?.groupId;
      }

      if (!groupId) {
        console.warn(`Skipping copy for subject ${subjectId} in class ${classId}: no groupId found`);
        continue;
      }

      // 1. Find or create ExamGroup
      const existingExamGroup = await db.examGroup.findFirst({
        where: { examId, sectionId, classId },
      });

      const examGroupId =
        existingExamGroup?.id ??
        (
          await db.examGroup.create({
            data: {
              classId,
              sectionId,
              examId,
            },
          })
        ).id;

      // 2. Find or create ExamSubject
      const existingExamSubject = await db.examSubject.findFirst({
        where: { subjectId, examGroupId },
      });

      let examSubjectId: string;
      const totalMarks = Number(item.totalMarks) || 0;
      const convertTo = Number(item.convertTo) || 0;
      const minMark = Number(item.minMark) || 0;

      if (existingExamSubject) {
        examSubjectId = existingExamSubject.id;
        await db.examSubject.update({
          where: { id: examSubjectId },
          data: {
            minMark,
            totalMarks,
            convertTo,
            groupId,
          },
        });
        // Remove existing partitions so we can cleanly insert copied ones
        await db.examSubjectPartition.deleteMany({
          where: { examSubjectId },
        });
      } else {
        const created = await db.examSubject.create({
          data: {
            subjectId,
            groupId,
            examGroupId,
            minMark,
            totalMarks,
            convertTo,
          },
        });
        examSubjectId = created.id;
      }

      // 3. Create partitions
      for (const p of item.partitions || []) {
        if (!p.assessmentFormatId) continue;
        await db.examSubjectPartition.create({
          data: {
            subjectId,
            examSubjectId,
            assessmentFormatId: p.assessmentFormatId,
            minMark: Number(p.minMark) || 0,
            convertTo: Number(p.convertTo) || 0,
            totalMarks: Number(p.totalMarks) || 0,
            order: Number(p.order) || 1,
            examGroupId,
            dateToConduct: p.dateToConduct ? new Date(p.dateToConduct) : new Date(),
            excludeSubjectValidation: Boolean(p.excludeSubjectValidation),
          },
        });
      }

      savedCount++;
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        copiedCount: savedCount,
      }),
      { status: StatusCodes.OK }
    );
  } catch (e: any) {
    captureException(e);
    console.error('Error in POST /api/exam/[id]/config/copy:', e);
    return new NextResponse(
      JSON.stringify({ error: e.message || 'Failed to copy exam configuration' }),
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
