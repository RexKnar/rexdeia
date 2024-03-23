import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import {
  CreateSubjectModel,
  UpdateSubjectModel,
} from '../../../lib/domain/subject';

type SubjectFilter = {
  assessmentFormatId: string;
};
export async function deleteSubjectById(id: string) {
  return db.subject.update({
    where: {
      id: id,
    },
    data: {
      isActive: false,
      updatedAt: new Date(),
    },
  });
}

export async function getSubjectById(id: string) {
  const session = await getServerSession(authOptions);
  return db.subject.findFirst({
    where: {
      id: id,
      branchId: session.branchId,
    },
    include: {
      subjectToAssessmentFormat: true,
      subjectToSubjectTypes: {
        include: {
          subjectType: true,
        },
      },
    },
  });
}

export async function updateSubjectById(
  id: string,
  updateSubject: UpdateSubjectModel
) {
  return db.subject.update({
    where: {
      id: id,
    },
    data: {
      ...updateSubject,
    },
  });
}

export async function addSubjects(subjects: CreateSubjectModel[]) {
  const createdSubjectsIds = [];
  const session = await getServerSession(authOptions);

  for (const subject of subjects) {
    const createdSubject = await db.subject.create({
      data: {
        name: subject.name,
        branchId: session.branchId,
        isActive: subject.isActive,
        description: subject.description,
        elective: +subject.elective,
        regulationId: subject.regulationId,
      },
    });
    createdSubjectsIds.push(createdSubject.id);

    await mapSubjectToSubjectType(createdSubject.id, subject.subjectTypeId);

    await mapSubjectToGroup(createdSubject.id, subject.groupIds);
    await mapSubjectToAssessmentFormat(
      createdSubject.id,
      subject.assessmentFormatIds
    );
  }

  return db.subject.findMany({
    where: {
      id: {
        in: createdSubjectsIds,
      },
    },
    include: {
      subjectToAssessmentFormat: true,
      subjectToSubjectTypes: {
        include: {
          subjectType: true,
        },
      },
    },
  });
}

export async function getAllSubjectBySectionId(id: string) {
  const subjects = await db.sectionSubject.findMany({
    where: {
      sectionId: id,
    },
    select: {
      subject: {
        include: {
          subjectToAssessmentFormat: {
            select: {
              assessmentFormat: true,
            },
          },
          subjectToGroup: {
            select: {
              group: true,
            },
          },
          subjectToSubjectTypes: {
            select: {
              subjectType: true,
            },
          },
          academicSubjectForStaff: {
            where: {
              sectionId: id,
            },
            select: {
              staff: {
                select: {
                  firstName: true,
                  middleName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return [...subjects.map((data) => data.subject)];
}

export async function getAllSubjectBySectionIds(ids: string[]) {
  const subjects = await db.sectionSubject.findMany({
    where: {
      sectionId: {
        in: ids,
      },
    },
    select: {
      subject: {
        include: {
          subjectToAssessmentFormat: {
            select: {
              assessmentFormat: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          subjectToSubjectTypes: {
            select: {
              subjectType: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          subjectToGroup: {
            select: {
              group: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          academicSubjectForStaff: {
            where: {
              sectionId: {
                in: ids,
              },
            },
            select: {
              staff: {
                select: {
                  id: true,
                  firstName: true,
                  middleName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return [...subjects.map((data) => data.subject)];
}

export async function getSubjectList(page: number, limit: number) {
  const session = await getServerSession(authOptions);

  const [total, subjectList] = await Promise.all([
    db.subject.count({
      where: {
        branchId: session.branchId,
      },
    }),
    db.subject.findMany({
      where: {
        branchId: session.branchId,
      },
      include: {
        subjectToAssessmentFormat: true,
        subjectToSubjectTypes: {
          include: {
            subjectType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
    }),
  ]);

  return {
    total,
    page,
    limit,
    data: subjectList,
  };
}

export async function getAllSubjectsWithFilter(
  page: number,
  limit: number,
  filter: SubjectFilter
) {
  const session = await getServerSession(authOptions);

  const [total, subjectsList] = await Promise.all([
    db.subject.count({
      where: {
        branchId: session.branchId,
      },
    }),
    db.subject.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        branchId: session.branchId,
        isDeleted: false,
        subjectToAssessmentFormat: {
          some: {
            assessmentFormatId: filter.assessmentFormatId,
          },
        },
      },
      include: {
        subjectToAssessmentFormat: true,
      },
    }),
  ]);

  return {
    page,
    total,
    limit,
    data: subjectsList,
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

export async function mapAssessmentFormatsToSubject(
  subjectId: string,
  assessmentFormatIds: string[]
) {
  await db.$transaction(
    assessmentFormatIds.map((assessmentFormatId) => {
      return db.subject.update({
        where: {
          id: subjectId,
        },
        data: {
          subjectToAssessmentFormat: {
            create: [{ assessmentFormatId: assessmentFormatId }],
          },
        },
      });
    })
  );
}

export async function mapSubjectToGroup(subjectId: string, groupIds: string[]) {
  await db.$transaction(
    groupIds.map((groupId) => {
      return db.subject.update({
        where: {
          id: subjectId,
        },
        data: {
          subjectToGroup: {
            create: [{ groupId: groupId }],
          },
        },
      });
    })
  );
}

export async function mapSubjectToAssessmentFormat(
  subjectId: string,
  assessmentFormatIds: string[]
) {
  await db.$transaction(
    assessmentFormatIds.map((assessmentId) => {
      return db.subject.update({
        where: {
          id: subjectId,
        },
        data: {
          subjectToAssessmentFormat: {
            create: [{ assessmentFormatId: assessmentId }],
          },
        },
      });
    })
  );
}

export async function mapSubjectToSubjectType(
  subjectId: string,
  subjectTypeId: string
) {
  return db.subject.update({
    where: {
      id: subjectId,
    },
    data: {
      subjectToSubjectTypes: {
        create: [{ subjectTypeId: subjectTypeId }],
      },
    },
  });
}
