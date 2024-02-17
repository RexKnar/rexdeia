import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import {
  CreateSubjectModel,
  UpdateSubjectModel,
} from '../../../lib/domain/subject';

type SubjectFilter = {
  subjectTypeIds: string[];
  categoryIds: string[];
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
      SubjectType: true,
      subjectToSubjectFormat: {
        include: {
          subjectFormat: true,
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
        subjectTypeId: subject.subjectTypeId,
        elective: subject.elective,
      },
    });
    createdSubjectsIds.push(createdSubject.id);

    await mapSubjectFormatsToSubject(
      createdSubject.id,
      subject.subjectFormatId
    );

    await mapSubjectToGroup(createdSubject.id, subject.groupId);
    await mapSubjectToCategory(createdSubject.id, subject.categoryId);
  }

  return db.subject.findMany({
    where: {
      id: {
        in: createdSubjectsIds,
      },
    },
    include: {
      SubjectType: true,
      subjectToSubjectFormat: {
        include: {
          subjectFormat: true,
        },
      },
    },
  });
}

export async function addSubject(createSubject: CreateSubjectModel) {
  const session = await getServerSession(authOptions);

  const createdSubject = await db.subject.create({
    data: {
      name: createSubject.name,
      branchId: session.branchId,
      description: createSubject.description,
      isActive: createSubject.isActive,
      subjectTypeId: createSubject.subjectTypeId,
      elective: createSubject.elective,
    },
  });
  return await mapSubjectFormatsToSubject(
    createdSubject.id,
    createSubject.subjectFormatId
  );
}

export async function getAllSubjectBySectionId(id: string) {
  const subjects = await db.sectionSubject.findMany({
    where: {
      sectionId: id,
    },
    select: {
      subject: {
        include: {
          SubjectType: true,
          subjectToSubjectFormat: {
            include: {
              subjectFormat: true,
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
          SubjectType: true,
          subjectToSubjectFormat: {
            include: {
              subjectFormat: true,
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
        SubjectType: true,
        subjectToSubjectFormat: {
          include: {
            subjectFormat: true,
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
        subjectTypeId: { in: filter.subjectTypeIds },
      },
    }),
    db.subject.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        branchId: session.branchId,
        subjectTypeId: { in: filter.subjectTypeIds },
        isDeleted: false,
        categories: {
          some: {
            categoryId: {
              in: filter.categoryIds,
            },
          },
        },
      },
      include: {
        categories: true,
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

export async function mapSubjectFormatsToSubject(
  subjectId: string,
  subjectFormatIds: string[]
) {
  await db.$transaction(
    subjectFormatIds.map((subjectFormatId) => {
      return db.subject.update({
        where: {
          id: subjectId,
        },
        data: {
          subjectToSubjectFormat: {
            create: [{ subjectFormatId: subjectFormatId }],
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

export async function mapSubjectToCategory(
  subjectId: string,
  categoryIds: string[]
) {
  await db.$transaction(
    categoryIds.map((categoryId) => {
      return db.subject.update({
        where: {
          id: subjectId,
        },
        data: {
          categories: {
            create: [{ categoryId: categoryId }],
          },
        },
      });
    })
  );
}
