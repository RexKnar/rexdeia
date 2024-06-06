import { db } from 'lib/db';

export async function getConfigDetailBySectionSubjectId(
  examId: string,
  subjectId: string,
  sectionId: string
) {
  const [response] = await db.examGroup.findMany({
    where: {
      examId,
      sectionId,
      examSubject: {
        some: { subjectId },
      },
    },
    select: {
      id: true,
      sectionId: true,
      examSubject: {
        select: {
          id: true,
          subjectId: true,
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
      },
    },
  });
  if (response?.examSubject) {
    const [responseData] = response.examSubject.map((subject) => {
      let returnData = {
        subjectId: subject.id,
        subjectName: subject.subject.name,
        examSubjectPartition: subject.examSubjectPartition,
      };
      return returnData;
    });

    return responseData || {};
  } else {
    return {};
  }
}
