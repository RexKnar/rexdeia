import { db } from 'lib/db';

export async function getExamSubjectDetailById(examSubjectId: string) {
  const response = await db.examSubject.findUnique({
    where: {
      id: examSubjectId,
    },

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
    },
  });

  return response || {};
}

export async function editExamSubject(payload: any, examSubjectId: string) {
  const { minMark, convertTo, totalMarks } = payload;
  return db.examSubject.update({
    where: {
      id: examSubjectId,
    },

    data: {
      minMark: +minMark,
      convertTo: +convertTo,
      totalMarks: +totalMarks,
    },
  });
}
