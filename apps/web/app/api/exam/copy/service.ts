import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function copyClass(payload: any) {
  const { examId, academicYearId: sourceAcademicYearId } = payload;
  const session = await getServerSession(authOptions);

  const oldExam = await db.exam.findUnique({
    where: {
      id: examId,
      batchId: sourceAcademicYearId,
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

  if (!oldExam) {
    return { success: false, error: 'Old exam not found' };
  }

  try {
    return await db.$transaction(
      async (prisma) => {
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

        for (const examGroup of oldExam.examGroup) {
          const section = await prisma.section.findFirst({
            where: {
              name: examGroup.section.name,
              classId: examGroup.section.classId,
              academicYearId: session.currentBatch,
            },
          });

          if (!section) {
            throw new Error(
              `Section not found: ${examGroup.section.name} for class ${examGroup.section.classId}`
            );
          }

          const newExamGroup = await prisma.examGroup.create({
            data: {
              totalMarks: examGroup.totalMarks,
              classId: examGroup.classId,
              examId: newExam.id,
              sectionId: section.id,
            },
          });

          await Promise.all(
            examGroup.examSubject.map(async (examSubject) => {
              const newExamSubject = await prisma.examSubject.create({
                data: {
                  subjectId: examSubject.subjectId,
                  groupId: examSubject.groupId,
                  examGroupId: newExamGroup.id,
                  minMark: examSubject.minMark,
                  totalMarks: examSubject.totalMarks,
                  convertTo: examSubject.convertTo,
                },
              });

              await Promise.all(
                examSubject.examSubjectPartition.map((partition) =>
                  prisma.examSubjectPartition.create({
                    data: {
                      subjectId: partition.subjectId,
                      examSubjectId: newExamSubject.id,
                      assessmentFormatId: partition.assessmentFormatId,
                      minMark: partition.minMark,
                      convertTo: partition.convertTo,
                      totalMarks: partition.totalMarks,
                      order: partition.order,
                      examGroupId: newExamGroup.id,
                      dateToConduct: partition.dateToConduct,
                      excludeSubjectValidation:
                        partition.excludeSubjectValidation,
                    },
                  })
                )
              );
            })
          );
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
  } catch (error) {
    console.error('Error copying class:', error);
    return {
      success: false,
      error: error?.message || 'Unknown error occurred',
    };
  }
}
