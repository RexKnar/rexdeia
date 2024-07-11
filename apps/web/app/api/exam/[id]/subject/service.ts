import { db } from 'lib/db';

export async function getExamSubjectsByClassSectionId(
  examId: string,
  classId?: string,
  sectionId?: string
) {
  const response = await db.examSubject.findMany({
    where: {
      examGroup: {
        examId,
        classId,
        sectionId,
      },
    },
    orderBy: {
      subject: {
        subjectOrder: 'asc',
      },
    },
    select: {
      id: true,
      totalMarks: true,
      convertTo: true,
      minMark: true,
      examGroup: {
        select: {
          classId: true,
          sectionId: true,
          examId: true,
          exam: true,
        },
      },
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
      examSubjectPartition: {
        include: {
          assessmentFormat: true,
        },
      },
    },
  });

  return response;
}
