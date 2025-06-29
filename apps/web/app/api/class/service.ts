import { AssignStudentsToClassModel } from 'lib/domain/student';
import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import {
  AssignStaffToClassRequestModel,
  CreateClassModel,
  MapEntitiesToClassModel,
  UpdateClassModel,
} from '../../../lib/domain/class';
import { CreateSectionModel } from '../../../lib/domain/section';
import {
  addSection,
  getAllSectionsByClassId,
  mapStaffsToSection,
} from '../section/service';
import { getAllStaffsBySectionsIdWithSubjects } from '../staff/service';
import { getAllStudentsBySectionIds } from '../student/service';

type ClassFilter = {
  isActive?: boolean;
};
type SectionDataType = {
  sectionId: string;
  sectionName: string;
  subjects: string[];
};
export async function getClassList(page: number, limit: number) {
  const session = await getServerSession(authOptions);
  const [classList, total] = await Promise.all([
    db.class.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        branchId: session.branchId,
      },
    }),
    db.class.count({
      where: {
        branchId: session.branchId,
        Section: {
          some: {
            academicYearId: session.currentBatch,
          },
        },
      },
    }),
  ]);

  const data = classList.map(async (classItem) => {
    const sections = await getAllSectionsByClassId(classItem.id);
    return {
      ...classItem,
      Section: sections,
    };
  });

  return {
    page,
    data,
    limit,
    total,
  };
}

export async function getAllClassesWithFilter(
  page: number,
  limit: number,
  filter: ClassFilter
) {
  const { isActive } = filter;
  const { branchId } = await getServerSession(authOptions);

  const whereClause = {
    branchId,
    isDeleted: false,
  };

  if (isActive !== undefined) {
    whereClause['isActive'] = isActive;
  }

  const [total, classList] = await Promise.all([
    db.class.count({
      where: whereClause,
    }),
    db.class.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: whereClause,
    }),
  ]);

  const data = await Promise.all(
    classList.map(async (classItem) => {
      const sections = await getAllSectionsByClassId(classItem.id);
      return {
        ...classItem,
        Section: sections,
      };
    })
  );

  return {
    page,
    total,
    limit,
    data,
  };
}

export async function getAllClassesByBatchId(batchId: string) {
  const session = await getServerSession(authOptions);
  return db.class.findMany({
    where: {
      branchId: session.branchId,
      batchId: batchId,
      isActive: true,
    },
  });
}

export async function addClass(classPayload: CreateClassModel) {
  const session = await getServerSession(authOptions);
  const createdClass = await db.class.create({
    data: {
      name: classPayload.name,
      isActive: classPayload.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
      classLevel: classPayload.classLevelId
        ? {
            connect: {
              id: classPayload.classLevelId,
            },
          }
        : null,
      grade: classPayload.gradeId
        ? {
            connect: {
              id: classPayload.gradeId,
            },
          }
        : null,
    },
  });

  classPayload.section.forEach((section) => {
    const createSectionModel: CreateSectionModel = {
      name: section.name,
      isActive: true,
      classId: createdClass.id,
      mediumId: section.mediumId,
      groupIds: section.groupIds,
      academicYearId: session.currentBatch,
    };
    addSection(createSectionModel);
  });

  return createdClass;
}

export async function deleteClassById(id: string) {
  const session = await getServerSession(authOptions);
  return db.class.update({
    where: {
      id: id,
      branchId: session.branchId,
    },
    data: {
      isActive: false,
      updatedAt: new Date(),
    },
  });
}

export async function getClassById(id: string) {
  const session = await getServerSession(authOptions);
  const response = id
    ? await db.class.findUnique({
        where: {
          id: id,
          branchId: session.branchId,
        },
      })
    : null;
  return response;
}

export async function updateClassById(
  id: string,
  updateClass: UpdateClassModel
) {
  const session = await getServerSession(authOptions);
  return db.class.update({
    where: {
      id: id,
      branchId: session.branchId,
    },
    data: {
      name: updateClass.name,
      isActive: updateClass.isActive,
      classLevel: {
        connect: {
          id: updateClass.classLevelId,
        },
      },
      grade: updateClass.gradeId
        ? {
            connect: {
              id: updateClass.gradeId,
            },
          }
        : null,
    },
  });
}

export async function mapStaffsToClass(
  classId: string,
  staffSubjects: MapEntitiesToClassModel
) {
  if (
    staffSubjects.sectionIds === undefined ||
    staffSubjects.sectionIds.length == 0
  ) {
    const sections = await getAllSectionsByClassId(classId);
    sections.forEach(function (section) {
      mapStaffsToSection(section.id, staffSubjects);
    });
  } else {
    staffSubjects.sectionIds.forEach(function (section) {
      mapStaffsToSection(section, staffSubjects);
    });
  }
}

export async function mapStudentToClass(
  classId: string,
  studentPayload: AssignStudentsToClassModel
) {
  return await db.$transaction(
    studentPayload.studentIds.map((studentId) => {
      return db.student.update({
        where: {
          id: studentId,
        },
        data: {
          studentMapping: {
            updateMany: [
              {
                where: {
                  studentId: studentId,
                },
                data: {
                  groupId: studentPayload.groupId,
                  classId: classId,
                  sectionId: studentPayload.sectionId,
                  batchId: studentPayload.academicYear,
                },
              },
            ],
          },
        },
      });
    })
  );
}

export async function assignStaffToClassWithSubject(
  payload: AssignStaffToClassRequestModel
) {
  const sectionInCharge = payload.sectionInCharge || [];
  const sectionIds = payload.sectionIds || [];
  return await db.$transaction(async (prisma) => {
    return await Promise.all([
      ...sectionIds.map(async (sectionId) => {
        if (payload.subjectId) {
          const existingSubject =
            await prisma.academicSubjectForStaff.findFirst({
              where: {
                subjectId: payload.subjectId,
                sectionId: sectionId,
                academicYearId: payload.academicYearId,
                isIncharge: false,
                staffId: payload.staffId,
                deletedAt: null,
              },
            });
          if (!existingSubject) {
            return prisma.section.update({
              where: { id: sectionId },
              data: {
                academicSubjectForStaff: {
                  create: [
                    {
                      subjectId: payload.subjectId,
                      staffId: payload.staffId,
                      academicYearId: payload.academicYearId,
                      isIncharge: false,
                    },
                  ],
                },
              },
            });
          }
        }
      }),
      ...sectionInCharge.map(async (sectionInCharge) => {
        const existingIncharge = await prisma.academicSubjectForStaff.findFirst(
          {
            where: {
              sectionId: sectionInCharge,
              academicYearId: payload.academicYearId,
              isIncharge: true,
              staffId: payload.staffId,
              deletedAt: null,
            },
          }
        );
        if (!existingIncharge) {
          return prisma.section.update({
            where: { id: sectionInCharge },
            data: {
              academicSubjectForStaff: {
                create: [
                  {
                    staffId: payload.staffId,
                    academicYearId: payload.academicYearId,
                    isIncharge: true,
                  },
                ],
              },
            },
          });
        }
      }),
    ]);
  });
}

export async function unMapStaffsFromClass(
  academicYearId: string,
  staffId: string,
  sectionData: SectionDataType[]
) {
  const response = await Promise.all(
    sectionData.map(async (section) => {
      if (section.subjects.length > 0) {
        return section.subjects.map(async (subject) => {
          const where = {
            // academicYearId_staffId_sectionId_subjectId_deletedAt: {
            academicYearId: academicYearId,
            staffId: staffId,
            sectionId: section.sectionId,
            subjectId: subject,
            deletedAt: null,
            // },
          };
          const innerResponse = await db.academicSubjectForStaff.updateMany({
            where,
            data: {
              deletedAt: new Date(),
            },
          });
          return innerResponse;
        });
      }
    })
  );
  return response;
}

export async function getAllSubjectByClassId(id: string) {
  const session = await getServerSession(authOptions);
  const academicYearId = session.currentBatch;

  if (!academicYearId) {
    throw new Error('No active academic year found');
  }

  return db.subject.findMany({
    where: {
      classId: id,
      branchId: session.branchId,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      subjectToAssessmentFormat: {
        select: {
          assessmentFormat: true,
        },
      },
      subjectMaster: {
        select: {
          id: true,
          name: true,
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
          academicYearId,
          section: {
            classId: id,
          },
        },
        distinct: ['staffId'],
        select: {
          staff: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
            },
          },
          section: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function getAllStudentsByClassId(id: string) {
  const sections = await getAllSectionsByClassId(id);
  const students = await getAllStudentsBySectionIds(sections.map((x) => x.id));
  return uniqBy(students, (student) => student.id);
}

export async function getAllStaffsByClassId(id: string) {
  const sections = await getAllSectionsByClassId(id);
  return await getAllStaffsBySectionsIdWithSubjects(sections.map((x) => x.id));
}

export async function getSubjectListForStaffByClassId(
  staffId: string,
  academicYearId: string,
  classId: string
) {
  const classDetails = await db.section.findMany({
    where: {
      classId: classId,
      academicSubjectForStaff: {
        some: {
          staffId: staffId,
          academicYearId: academicYearId,
          isIncharge: false,
          deletedAt: null,
        },
      },
    },
    select: {
      id: true,
      name: true,
      academicSubjectForStaff: {
        where: {
          staffId: staffId,
          academicYearId: academicYearId,
          isIncharge: false,
          deletedAt: null,
        },
        select: {
          subject: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return formatData(classDetails);
}

function formatData(data) {
  return data.map((section) => ({
    sectionId: section.id,
    sectionName: section.name,
    subjects: section.academicSubjectForStaff
      .filter((subject) => subject.subject)
      .map((subjectEntry) => ({
        id: subjectEntry.subject.id,
        name: subjectEntry.subject.name,
      })),
  }));
}

export async function getAllStudentByClassIdForAssigning(id: string) {
  const studentList = await db.studentMapping.findMany({
    where: {
      classId: id,
      section: null,
      isCurrent: true,
    },
    select: {
      student: {
        select: {
          id: true,
          firstName: true,
        },
      },
    },
    orderBy: [
      {
        rollNumber: 'asc',
      },
    ],
  });
  const studentResponse = studentList.map((students) => students.student);
  return studentResponse;
}
