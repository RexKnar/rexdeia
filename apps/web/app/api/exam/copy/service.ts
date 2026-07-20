import { randomUUID } from 'crypto';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function copyClassNew(payload: any) {
  const { examId, academicYearId: sourceAcademicYearId, name } = payload;
  const session = await getServerSession(authOptions);

  if (!session || !session.currentBatch) {
    return { success: false, error: 'Academic year session context not found' };
  }

  const oldExam = await db.exam.findUnique({
    where: {
      id: examId,
    },
    include: {
      examGroup: {
        include: {
          examSubject: {
            include: {
              examSubjectPartition: true,
            },
          },
          section: true,
        },
      },
      examType: true,
      term: true,
      batch: true,
    },
  });

  if (!oldExam || oldExam.batchId !== sourceAcademicYearId) {
    console.log('[CopyExamDebug] Old exam not found or batch mismatch:', {
      examId,
      expectedBatch: sourceAcademicYearId,
      foundBatch: oldExam?.batchId,
    });
    return { success: false, error: 'Old exam not found' };
  }

  console.log('[CopyExamDebug] Found old exam:', oldExam.name, 'with examGroup count:', oldExam.examGroup.length);

  try {
    return await db.$transaction(
      async (prisma) => {
        // Query all matching target sections first to avoid N+1 queries
        const sectionNames = oldExam.examGroup.map((eg) => eg.section.name);
        const classIds = oldExam.examGroup.map((eg) => eg.classId);

        const targetSections = await prisma.section.findMany({
          where: {
            name: { in: sectionNames },
            classId: { in: classIds },
            academicYearId: session.currentBatch,
            isDeleted: false,
          },
        });

        const sectionMap = new Map<string, any>();
        for (const sec of targetSections) {
          sectionMap.set(`${sec.name}-${sec.classId}`, sec);
        }

        // Step 1: Create the exam shell (no nested relations yet)
        const newExam = await prisma.exam.create({
          data: {
            name: name || oldExam.name,
            isActive: oldExam.isActive,
            branchId: oldExam.branchId,
            markEntryOpenDate: oldExam.markEntryOpenDate,
            markEntryEndDate: oldExam.markEntryEndDate,
            markEntryCorrectionDate: oldExam.markEntryCorrectionDate,
            blockMarkEntry: oldExam.blockMarkEntry,
            termId: oldExam.termId,
            batchId: session.currentBatch,
            examTypeId: oldExam.examTypeId,
          },
        });

        console.log('[CopyExamDebug] Created newExam:', newExam.id);

        // Step 2: Create ExamGroups, ExamSubjects, and ExamSubjectPartitions sequentially
        // so that FK references are always satisfied before child rows are inserted.
        for (const examGroup of oldExam.examGroup) {
          const section = sectionMap.get(`${examGroup.section.name}-${examGroup.classId}`);
          if (!section) {
            console.log('[CopyExamDebug] Skipping examGroup', examGroup.id, '— section not found in target batch');
            continue;
          }

          // 2a: Create ExamGroup first so its id exists in DB before partitions reference it
          const newGroupId = randomUUID();
          await prisma.examGroup.create({
            data: {
              id: newGroupId,
              totalMarks: examGroup.totalMarks,
              classId: examGroup.classId,
              sectionId: section.id,
              examId: newExam.id,
            },
          });

          console.log('[CopyExamDebug] Created ExamGroup:', newGroupId);

          // 2b: Create ExamSubjects for this group
          for (const examSubject of examGroup.examSubject) {
            const newSubjectId = randomUUID();
            await prisma.examSubject.create({
              data: {
                id: newSubjectId,
                subjectId: examSubject.subjectId,
                groupId: examSubject.groupId,
                minMark: examSubject.minMark,
                totalMarks: examSubject.totalMarks,
                convertTo: examSubject.convertTo,
                examGroupId: newGroupId,
              },
            });

            // 2c: Create ExamSubjectPartitions — now both examGroup and examSubject exist
            for (const partition of examSubject.examSubjectPartition) {
              await prisma.examSubjectPartition.create({
                data: {
                  id: randomUUID(),
                  subjectId: partition.subjectId,
                  minMark: partition.minMark,
                  totalMarks: partition.totalMarks,
                  partitionName: partition.partitionName,
                  assessmentFormatId: partition.assessmentFormatId,
                  convertTo: partition.convertTo,
                  dateToConduct: partition.dateToConduct,
                  excludeSubjectValidation: partition.excludeSubjectValidation,
                  order: partition.order,
                  examGroupId: newGroupId,      // ← parent ExamGroup already inserted above
                  examSubjectId: newSubjectId,  // ← parent ExamSubject already inserted above
                },
              });
            }
          }
        }

        console.log('[CopyExamDebug] All groups, subjects, and partitions created for exam:', newExam.id);

        return {
          success: true,
          exam: newExam,
        };
      },
      {
        timeout: 60000,
      }
    );
  } catch (error: any) {
    console.error('[CopyExamDebug] Error copying exam:', error);
    return {
      success: false,
      error: error?.message || 'Unknown error occurred',
    };
  }
}

export async function copyClass(payload: any) {
  const { examId, academicYearId: sourceAcademicYearId } = payload;
  const session = await getServerSession(authOptions);

  if (!session?.currentBatch) {
    return { success: false, error: 'Academic year session context not found' };
  }

  // ── All reads happen OUTSIDE the transaction ──────────────────────────────
  const oldExam = await db.exam.findUnique({
    where: { id: examId, batchId: sourceAcademicYearId },
    include: {
      examGroup: {
        include: {
          examSubject: { include: { examSubjectPartition: true } },
          section: true,
        },
      },
    },
  });

  if (!oldExam) {
    return { success: false, error: 'Old exam not found' };
  }

  // Pre-fetch all target sections in one query (avoids N+1 inside the tx)
  const sectionNames = oldExam.examGroup.map((eg) => eg.section.name);
  const classIds = oldExam.examGroup.map((eg) => eg.section.classId);

  const targetSections = await db.section.findMany({
    where: {
      name: { in: sectionNames },
      classId: { in: classIds },
      academicYearId: session.currentBatch,
      isDeleted: false,
    },
  });

  const sectionMap = new Map<string, string>(); // "name-classId" → sectionId
  for (const sec of targetSections) {
    sectionMap.set(`${sec.name}-${sec.classId}`, sec.id);
  }

  // Build all the data to insert in memory (no DB calls needed)
  const examGroupRows: any[] = [];
  const examSubjectRows: any[] = [];
  const partitionRows: any[] = [];

  for (const examGroup of oldExam.examGroup) {
    const newSectionId = sectionMap.get(
      `${examGroup.section.name}-${examGroup.section.classId}`
    );
    if (!newSectionId) continue; // skip groups whose section doesn't exist in the target year

    const newGroupId = randomUUID();
    examGroupRows.push({
      id: newGroupId,
      totalMarks: examGroup.totalMarks,
      classId: examGroup.classId,
      sectionId: newSectionId,
      // examId is set inside the transaction after exam is created
      _examId: null as string | null, // placeholder; filled below
    });

    for (const examSubject of examGroup.examSubject) {
      const newSubjectId = randomUUID();
      examSubjectRows.push({
        id: newSubjectId,
        subjectId: examSubject.subjectId,
        groupId: examSubject.groupId,
        examGroupId: newGroupId,
        minMark: examSubject.minMark,
        totalMarks: examSubject.totalMarks,
        convertTo: examSubject.convertTo,
      });

      for (const partition of examSubject.examSubjectPartition) {
        partitionRows.push({
          id: randomUUID(),
          subjectId: partition.subjectId,
          examSubjectId: newSubjectId,
          assessmentFormatId: partition.assessmentFormatId,
          minMark: partition.minMark,
          convertTo: partition.convertTo,
          totalMarks: partition.totalMarks,
          order: partition.order,
          examGroupId: newGroupId,
          dateToConduct: partition.dateToConduct,
          excludeSubjectValidation: partition.excludeSubjectValidation,
        });
      }
    }
  }

  // ── Transaction: only writes, no reads ───────────────────────────────────
  try {
    return await db.$transaction(
      async (prisma) => {
        // 1. Create the exam
        const newExam = await prisma.exam.create({
          data: {
            name: oldExam.name,
            isActive: oldExam.isActive,
            branchId: oldExam.branchId,
            markEntryOpenDate: oldExam.markEntryOpenDate,
            markEntryEndDate: oldExam.markEntryEndDate,
            markEntryCorrectionDate: oldExam.markEntryCorrectionDate,
            blockMarkEntry: oldExam.blockMarkEntry,
            termId: oldExam.termId,
            batchId: session.currentBatch,
            examTypeId: oldExam.examTypeId,
          },
        });

        // 2. Batch-insert all exam groups
        await prisma.examGroup.createMany({
          data: examGroupRows.map(({ _examId: _ignored, ...row }) => ({
            ...row,
            examId: newExam.id,
          })),
        });

        // 3. Batch-insert all exam subjects
        if (examSubjectRows.length > 0) {
          await prisma.examSubject.createMany({ data: examSubjectRows });
        }

        // 4. Batch-insert all partitions
        if (partitionRows.length > 0) {
          await prisma.examSubjectPartition.createMany({ data: partitionRows });
        }

        return { success: true, exam: newExam };
      },
      { timeout: 30000 } // short timeout — transaction only does writes now
    );
  } catch (error: any) {
    console.error('Error copying class:', error);
    return {
      success: false,
      error: error?.message || 'Unknown error occurred',
    };
  }
}
