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
        where: {
          subjectId,
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

export async function getConfigDetailBySectionIdsAndSubjectId(
  examId: string,
  subjectId: string,
  sectionIds: string[]
) {
  const response = await db.examGroup.findMany({
    where: {
      examId,
      sectionId: { in: sectionIds },
      examSubject: {
        some: { subjectId },
      },
    },
    select: {
      id: true,
      sectionId: true,
      section: {
        select: {
          id: true,
          name: true,
        },
      },
      examSubject: {
        where: {
          subjectId,
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
          examSubjectPartition: {
            include: {
              assessmentFormat: true,
            },
          },
        },
      },
    },
  });

  const filteredSubjects = response
    .flatMap((group) =>
      group.examSubject.map((subject) => ({
        ...subject,
        section: group.section,
      }))
    )
    .filter((subject) => subject.subjectId === subjectId);

  const responseData = filteredSubjects.map((subject) => ({
    subjectId: subject.subject?.id,
    subjectName: subject.subject?.name,
    section: {
      id: subject.section?.id,
      name: subject.section?.name,
    },
    examSubjectPartition: subject.examSubjectPartition,
  }));

  return responseData || [];
}
