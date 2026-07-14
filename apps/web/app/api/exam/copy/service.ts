import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function copyClass(payload: any) {
  const { examId, academicYearId: sourceAcademicYearId, name } = payload;
  const session = await getServerSession(authOptions);

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

        console.log('[CopyExamDebug] Created newExam:', newExam.id, 'for target batch:', session.currentBatch);

        for (const examGroup of oldExam.examGroup) {
          // Find the corresponding section in the target academic year by name and classId
          const section = await prisma.section.findFirst({
            where: {
              name: examGroup.section.name,
              classId: examGroup.classId,
              academicYearId: session.currentBatch,
              isDeleted: false,
            },
          });

          console.log('[CopyExamDebug] Section lookup:', {
            sectionName: examGroup.section.name,
            classId: examGroup.classId,
            academicYearId: session.currentBatch,
            found: !!section,
            id: section?.id,
          });

          if (section) {
            const newExamGroup = await prisma.examGroup.create({
              data: {
                totalMarks: examGroup.totalMarks,
                classId: examGroup.classId, // Class is global, use original classId
                examId: newExam.id,
                sectionId: section.id, // Section is batch-specific
              },
            });
            console.log('[CopyExamDebug] Created newExamGroup:', newExamGroup.id);

            for (const examSubject of examGroup.examSubject) {
              const newExamSubject = await prisma.examSubject.create({
                data: {
                  subjectId: examSubject.subjectId, // Subject is global, use original subjectId
                  groupId: examSubject.groupId, // Group is global, use original groupId
                  examGroupId: newExamGroup.id,
                  minMark: examSubject.minMark,
                  totalMarks: examSubject.totalMarks,
                  convertTo: examSubject.convertTo,
                },
              });
              console.log('[CopyExamDebug] Created newExamSubject:', newExamSubject.id, 'for subjectId:', examSubject.subjectId);

              for (const partition of examSubject.examSubjectPartition) {
                const newPartition = await prisma.examSubjectPartition.create({
                  data: {
                    subjectId: partition.subjectId, // Subject is global
                    examSubjectId: newExamSubject.id,
                    assessmentFormatId: partition.assessmentFormatId,
                    minMark: partition.minMark,
                    convertTo: partition.convertTo,
                    totalMarks: partition.totalMarks,
                    order: partition.order,
                    examGroupId: newExamGroup.id,
                    dateToConduct: partition.dateToConduct,
                    excludeSubjectValidation: partition.excludeSubjectValidation,
                  },
                });
                console.log('[CopyExamDebug] Created partition:', newPartition.id);
              }
            }
          } else {
            console.log('[CopyExamDebug] Skipping examGroup', examGroup.id, 'because section was not found in target batch');
          }
        }

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
