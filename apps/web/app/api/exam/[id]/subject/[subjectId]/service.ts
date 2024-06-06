import { db } from 'lib/db';

export async function getSubjectConfigDetailById(
  examId: string,
  subjectId: string,
  sectionId: string
) {
  const [response] = await db.academicExams.findMany({
    where: {
      examId,
      subjectId,
      sectionId,
    },
    select: {
      id: true,
      subjectId: true,
      sectionId: true,
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
