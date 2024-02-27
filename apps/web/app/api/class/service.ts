import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import {
  CreateClassModel,
  MapEntitiesToClassModel,
  mapStaffToClassModel,
  UpdateClassModel,
} from '../../../lib/domain/class';
import { CreateSectionModel } from '../../../lib/domain/section';
import {
  addSection,
  getAllSectionsByClassId,
  mapStaffsToSection,
  mapSubjectsToSection,
  unMapStaffsFromSection,
  unMapSubjectsFromSection,
} from '../section/service';
import { getAllStaffsBySectionsId } from '../staff/service';
import { getAllStudentsBySectionIds } from '../student/service';
import { getAllSubjectBySectionIds } from '../subject/service';

type ClassFilter = {
  status: boolean;
};
export async function getClassList(page: number, limit: number) {
  const session = await getServerSession(authOptions);
  const [ClassList, totalClasses] = await Promise.all([
    db.class.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        branchId: session.branchId,
      },
      include: {
        Section: true,
      },
    }),
    db.class.count({
      where: {
        branchId: session.branchId,
      },
    }),
  ]);

  return {
    page,
    limit,
    data: ClassList,
    total: totalClasses,
  };
}

export async function getAllClassesWithFilter(
  page: number,
  limit: number,
  filter: ClassFilter
) {
  const session = await getServerSession(authOptions);

  const [total, classList] = await Promise.all([
    db.class.count({
      where: {
        branchId: session.branchId,
      },
    }),
    db.class.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        branchId: session.branchId,
        isDeleted: false,
        ...filter,
      },
    }),
  ]);

  return {
    page,
    total,
    limit,
    data: classList,
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
    },
  });

  classPayload.section.forEach((section) => {
    const createSectionModel: CreateSectionModel = {
      name: section.name,
      isActive: true,
      classId: createdClass.id,
      mediumId: section.mediumId,
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
  return db.class.findFirst({
    where: {
      id: id,
      branchId: session.branchId,
    },
  });
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
    },
  });
}

export async function mapSubjectsToClass(
  classId: string,
  subjectIds: string[]
) {
  const sections = await getAllSectionsByClassId(classId);
  sections.forEach(function (section) {
    mapSubjectsToSection(section.id, subjectIds);
  });
}

export async function unMapSubjectsFromClass(
  classId: string,
  mapEntitiesToClassModel: MapEntitiesToClassModel
) {
  if (
    mapEntitiesToClassModel.sectionIds === undefined ||
    mapEntitiesToClassModel.sectionIds.length == 0
  ) {
    const sections = await getAllSectionsByClassId(classId);
    sections.forEach(function (section) {
      unMapSubjectsFromSection(section.id, {
        entities: mapEntitiesToClassModel.entities,
      });
    });
  } else {
    mapEntitiesToClassModel.sectionIds.forEach(function (section) {
      unMapSubjectsFromSection(section, {
        entities: mapEntitiesToClassModel.entities,
      });
    });
  }
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

export async function assignStaffToClassWithSubject(
  staffPayload: mapStaffToClassModel
) {
  const assignStaff = await Promise.all(
    staffPayload.sectionIds.map(async (sectionId) => {
      return await db.section.update({
        where: { id: sectionId },
        data: {
          academicSubjectForStaff: {
            create: [
              {
                subjectId: staffPayload.subjectId,
                staffId: staffPayload.staffId,
                academicYearId: staffPayload.academicYearId,
              },
            ],
          },
        },
      });
    })
  );
  return assignStaff;
}

export async function assignClassInCharge(staffPayload: mapStaffToClassModel) {
  const assignSectionInCharge = await Promise.all(
    staffPayload.sectionInCharge.map(async (sectionId) => {
      return await db.section.update({
        where: { id: sectionId },
        data: {
          classInCharge: {
            create: [
              {
                staffId: staffPayload.staffId,
                academicYearId: staffPayload.academicYearId,
              },
            ],
          },
        },
      });
    })
  );
  return assignSectionInCharge;
}

export async function unMapStaffsFromClass(
  classId: string,
  staffIds: string[],
  sectionIds: string[]
) {
  if (sectionIds === undefined || sectionIds.length == 0) {
    const sections = await getAllSectionsByClassId(classId);
    sections.forEach(function (section) {
      unMapStaffsFromSection(section.id, staffIds);
    });
  } else {
    sectionIds.forEach(function (section) {
      unMapStaffsFromSection(section, staffIds);
    });
  }
}

export async function getAllSubjectByClassId(id: string) {
  const sections = await getAllSectionsByClassId(id);
  const subjects = await getAllSubjectBySectionIds(sections.map((x) => x.id));
  return uniqBy(subjects, (subject) => subject.id);
}

export async function getAllStudentsByClassId(id: string) {
  const sections = await getAllSectionsByClassId(id);
  const students = await getAllStudentsBySectionIds(sections.map((x) => x.id));
  return uniqBy(students, (student) => student.id);
}

export async function getAllStaffsByClassId(id: string) {
  const sections = await getAllSectionsByClassId(id);
  const staffs = await getAllStaffsBySectionsId(sections.map((x) => x.id));
  return uniqBy(staffs, (staff) => staff.id);
}
