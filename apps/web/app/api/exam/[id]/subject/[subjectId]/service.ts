import { db } from 'lib/db';

export async function getSubjectConfigDetailById(
  examId: string,
  subjectId: string
) {
  const [response] = await db.academicExams.findMany({
    where: {
      examId,
      subjectId,
    },
    select: {
      id: true,
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
      examConfiguration: {
        include: {
          assessmentFormat: true,
        },
      },
    },
  });

  return response;
}
