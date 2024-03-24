import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

type SubjectFilter = {
  sectionId: string;
  subjectTypeId: string;
};
export async function getSubjectsWithFilter(filter: SubjectFilter) {
  const { branchId } = await getServerSession(authOptions);

  const [total, data] = await db.$transaction([
    db.subject.count({
      where: {
        branchId,
        isDeleted: false,
        subjectToSubjectTypes: {
          some: {
            subjectTypeId: filter.subjectTypeId,
          },
        },
        SectionSubject: {
          some: {
            sectionId: filter.sectionId,
          },
        },
      },
    }),
    db.subject.findMany({
      where: {
        branchId,
        isDeleted: false,
        subjectToSubjectTypes: {
          some: {
            subjectTypeId: filter.subjectTypeId,
          },
        },
        SectionSubject: {
          some: {
            sectionId: filter.sectionId,
          },
        },
      },
    }),
  ]);

  return {
    total,
    data,
  };
}

export async function getAssessmentFormatBySubjectId(subjectId: string) {
  const response = await db.subjectToAssessmentFormat.findMany({
    where: {
      subjectId: subjectId,
      assessmentFormat: {
        hasMarkEntry: true,
      },
    },
    include: {
      assessmentFormat: true,
    },
  });
  return [...response.map((data) => data.assessmentFormat)];
}
