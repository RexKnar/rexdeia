import { randomUUID } from 'crypto';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function copyClass(payload: any) {
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

        const examGroupsData: any[] = [];

        for (const examGroup of oldExam.examGroup) {
          const section = sectionMap.get(`${examGroup.section.name}-${examGroup.classId}`);
          
          if (section) {
            const examGroupId = randomUUID();
            
            examGroupsData.push({
              id: examGroupId,
              totalMarks: examGroup.totalMarks,
              classId: examGroup.classId,
              sectionId: section.id,
              examSubject: {
                create: examGroup.examSubject.map((examSubject) => {
                  const examSubjectId = randomUUID();
                  return {
                    id: examSubjectId,
                    subjectId: examSubject.subjectId,
                    groupId: examSubject.groupId,
                    minMark: examSubject.minMark,
                    totalMarks: examSubject.totalMarks,
                    convertTo: examSubject.convertTo,
                    examSubjectPartition: {
                      create: examSubject.examSubjectPartition.map((partition) => {
                        return {
                          id: randomUUID(),
                          subjectId: partition.subjectId,
                          minMark: partition.minMark,
                          totalMarks: partition.totalMarks,
                          partitionName: partition.partitionName,
                          assessmentFormatId: partition.assessmentFormatId,
                          convertTo: partition.convertTo,
                          dateToConduct: partition.dateToConduct,
                          examGroupId: examGroupId,
                          excludeSubjectValidation: partition.excludeSubjectValidation,
                          order: partition.order,
                        };
                      }),
                    },
                  };
                }),
              },
            });
            console.log('[CopyExamDebug] Prepared nested examGroup:', examGroupId);
          } else {
            console.log('[CopyExamDebug] Skipping examGroup', examGroup.id, 'because section was not found in target batch');
          }
        }

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
            examGroup: {
              create: examGroupsData,
            },
          },
        });

        console.log('[CopyExamDebug] Created newExam with nested relations:', newExam.id);

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

