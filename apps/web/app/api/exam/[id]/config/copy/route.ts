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

    // Query already-configured sections for this exam to skip them
    const existingConfiguredGroups = await db.examGroup.findMany({
      where: {
        examId,
        examSubject: {
          some: {},
        },
      },
      select: {
        sectionId: true,
      },
    });

    const alreadyConfiguredSectionIds = new Set(
      existingConfiguredGroups.map((g) => g.sectionId)
    );

    // 1. Filter valid items to copy
    const validItems = items.filter((item: any) => {
      const { classId, sectionId, subjectId } = item;
      return (
        classId &&
        sectionId &&
        subjectId &&
        !alreadyConfiguredSectionIds.has(sectionId)
      );
    });

    if (validItems.length === 0) {
      return new NextResponse(
        JSON.stringify({
          success: true,
          copiedCount: 0,
        }),
        { status: StatusCodes.OK }
      );
    }

    const uniqueSubjectIds = Array.from(
      new Set(validItems.map((i: any) => i.subjectId as string))
    );
    const uniqueClassIds = Array.from(
      new Set(validItems.map((i: any) => i.classId as string))
    );
    const uniqueSectionIds = Array.from(
      new Set(validItems.map((i: any) => i.sectionId as string))
    );

    // 2. Pre-fetch subjectToGroup, sectionToGroups, and examGroups in parallel
    const [subToGroups, secToGroups, existingExamGroups] = await Promise.all([
      db.subjectToGroup.findMany({
        where: {
          subjectId: { in: uniqueSubjectIds },
          classId: { in: uniqueClassIds },
        },
        select: { subjectId: true, classId: true, groupId: true },
      }),
      db.sectionToGroups.findMany({
        where: { sectionId: { in: uniqueSectionIds } },
        select: { sectionId: true, groupId: true },
      }),
      db.examGroup.findMany({
        where: { examId, sectionId: { in: uniqueSectionIds } },
        select: { id: true, classId: true, sectionId: true },
      }),
    ]);

    const subToGroupMap = new Map<string, string>();
    for (const sg of subToGroups) {
      if (sg.groupId)
        subToGroupMap.set(`${sg.subjectId}:${sg.classId}`, sg.groupId);
    }

    const secToGroupMap = new Map<string, string>();
    for (const sc of secToGroups) {
      if (sc.groupId) secToGroupMap.set(sc.sectionId, sc.groupId);
    }

    const examGroupMap = new Map<string, string>();
    for (const eg of existingExamGroups) {
      examGroupMap.set(`${eg.classId}:${eg.sectionId}`, eg.id);
    }

    // 3. Ensure all needed ExamGroups exist
    const missingExamGroups: { classId: string; sectionId: string }[] = [];
    const seenExamGroupKeys = new Set<string>();
    for (const item of validItems) {
      const key = `${item.classId}:${item.sectionId}`;
      if (!examGroupMap.has(key) && !seenExamGroupKeys.has(key)) {
        seenExamGroupKeys.add(key);
        missingExamGroups.push({
          classId: item.classId,
          sectionId: item.sectionId,
        });
      }
    }

    for (const missing of missingExamGroups) {
      const created = await db.examGroup.create({
        data: {
          classId: missing.classId,
          sectionId: missing.sectionId,
          examId,
        },
      });
      examGroupMap.set(`${missing.classId}:${missing.sectionId}`, created.id);
    }

    // 4. Pre-fetch existing ExamSubjects for these exam groups
    const allExamGroupIds = Array.from(examGroupMap.values());
    const existingExamSubjects = await db.examSubject.findMany({
      where: {
        examGroupId: { in: allExamGroupIds },
        subjectId: { in: uniqueSubjectIds },
      },
      select: { id: true, examGroupId: true, subjectId: true },
    });

    const examSubjectMap = new Map<string, string>();
    for (const es of existingExamSubjects) {
      examSubjectMap.set(`${es.examGroupId}:${es.subjectId}`, es.id);
    }

    // 5. Prepare ExamSubjects and Partitions
    const subjectIdsToClean: string[] = [];
    const partitionsToCreate: any[] = [];

    for (const item of validItems) {
      const { classId, sectionId, subjectId } = item;
      const groupId =
        item.groupId ||
        subToGroupMap.get(`${subjectId}:${classId}`) ||
        secToGroupMap.get(sectionId);

      if (!groupId) {
        console.warn(
          `Skipping copy for subject ${subjectId} in class ${classId}: no groupId found`
        );
        continue;
      }

      const examGroupId = examGroupMap.get(`${classId}:${sectionId}`);
      if (!examGroupId) continue;

      const totalMarks = Number(item.totalMarks) || 0;
      const convertTo = Number(item.convertTo) || 0;
      const minMark = Number(item.minMark) || 0;

      let examSubjectId = examSubjectMap.get(`${examGroupId}:${subjectId}`);

      if (examSubjectId) {
        await db.examSubject.update({
          where: { id: examSubjectId },
          data: { minMark, totalMarks, convertTo, groupId },
        });
        subjectIdsToClean.push(examSubjectId);
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
        examSubjectMap.set(`${examGroupId}:${subjectId}`, examSubjectId);
      }

      for (const p of item.partitions || []) {
        if (!p.assessmentFormatId) continue;
        partitionsToCreate.push({
          subjectId,
          examSubjectId,
          assessmentFormatId: p.assessmentFormatId,
          minMark: Number(p.minMark) || 0,
          convertTo: Number(p.convertTo) || 0,
          totalMarks: Number(p.totalMarks) || 0,
          order: Number(p.order) || 1,
          examGroupId,
          dateToConduct: p.dateToConduct
            ? new Date(p.dateToConduct)
            : new Date(),
          excludeSubjectValidation: Boolean(p.excludeSubjectValidation),
        });
      }

      savedCount++;
    }

    // 6. Bulk delete replaced partitions and bulk create new partitions
    if (subjectIdsToClean.length > 0) {
      await db.examSubjectPartition.deleteMany({
        where: { examSubjectId: { in: subjectIdsToClean } },
      });
    }

    if (partitionsToCreate.length > 0) {
      await db.examSubjectPartition.createMany({
        data: partitionsToCreate,
      });
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
