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
  try {
    return await db.$transaction(async (prisma) => {
      const newExamDetails = {
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
      };

      const newExam = await prisma.exam.create({
        data: newExamDetails,
      });
      for (const examGroup of oldExam.examGroup) {
        const section = await db.section.findFirst({
          where: {
            name: examGroup.section.name,
            classId: examGroup.section.classId,
            academicYearId: session.currentBatch,
          },
        });

        const newExamGroup = await prisma.examGroup.create({
          data: {
            totalMarks: examGroup.totalMarks,
            classId: examGroup.classId,
            examId: newExam.id,
            sectionId: section.id,
          },
        });

        for (const examSubject of examGroup.examSubject) {
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
          for (const examSubjectPartition of examSubject.examSubjectPartition) {
            await prisma.examSubjectPartition.create({
              data: {
                subjectId: examSubjectPartition.subjectId,
                examSubjectId: newExamSubject.id,
                assessmentFormatId: examSubjectPartition.assessmentFormatId,
                minMark: examSubjectPartition.minMark,
                convertTo: examSubjectPartition.convertTo,
                totalMarks: examSubjectPartition.totalMarks,
                order: examSubjectPartition.order,
                examGroupId: newExamGroup.id,
                dateToConduct: examSubjectPartition.dateToConduct,
                excludeSubjectValidation:
                  examSubjectPartition.excludeSubjectValidation,
              },
            });
          }
        }
      }

      return {
        success: true,
        exam: newExam,
      };
    });
  } catch (e) {
    return e;
  }
}
