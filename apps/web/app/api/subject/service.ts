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

export async function addSubjects(id: string, subjects: CreateSubjectModel[]) {
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
        subjectMasterId: subject.subjectMasterId,
        classId: id,
      },
    });

    await mapSubjectToSubjectType(createdSubject.id, subject.subjectTypeId);

    await mapSubjectToGroup(createdSubject.id, subject.groupIds, id);
    await mapSubjectToAssessmentFormat(
      createdSubject.id,
      subject.assessmentFormatIds
    );
  }
}

export async function getAllSubjectBySectionId(id: string, classId: string) {
  const subjects = await db.section.findMany({
    where: {
      id: id,
    },
    select: {
      sectionToGroups: {
        select: {
          group: {
            select: {
              name: true,
              id: true,
              subjectToGroup: {
                where: { classId: classId },
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
              },
            },
          },
        },
      },
    },
  });
  const subjectsWithGroup = subjects
    .map((section) => {
      return section.sectionToGroups.map((groupData) => {
        const groupInfo = {
          id: groupData.group.id,
          name: groupData.group.name,
          subject: groupData.group.subjectToGroup.map((subjectGroup) => ({
            id: subjectGroup.subject.id,
            name: subjectGroup.subject.name,
          })),
        };
        return groupInfo;
      });
    })
    .flat();
  return subjectsWithGroup;
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

export async function mapSubjectToGroup(
  subjectId: string,
  groupIds: string[],
  classId: string
) {
  await db.$transaction(
    groupIds.map((groupId) => {
      return db.subject.update({
        where: {
          id: subjectId,
        },
        data: {
          subjectToGroup: {
            create: [{ groupId: groupId, classId: classId }],
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
