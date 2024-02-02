import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import {
  CreateSubjectModel,
  UpdateSubjectModel,
} from '../../../lib/domain/subject';

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
      SubjectFormat: true,
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
  const session = await getServerSession(authOptions);

  // Using this workaround to avoid Prisma bug with createMany of not returning created records.
  // https://github.com/prisma/prisma/issues/8131#issuecomment-997667070
  return await db.$transaction(
    subjects.map((subject) =>
      db.subject.create({
        data: {
          name: subject.name,
          branchId: session.branchId,
          isActive: subject.isActive,
          description: subject.description,
          subjectTypeId: subject.subjectTypeId,
          subjectFormatId: subject.subjectFormatId,
        },
      })
    )
  );
}

export async function addSubject(createSubject: CreateSubjectModel) {
  const session = await getServerSession(authOptions);

  return db.subject.create({
    data: {
      name: createSubject.name,
      branchId: session.branchId,
      description: createSubject.description,
      isActive: createSubject.isActive,
      subjectTypeId: createSubject.subjectTypeId,
      subjectFormatId: createSubject.subjectFormatId,
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
          SubjectType: true,
          SubjectFormat: true,
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
          SubjectFormat: true,
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
        SubjectFormat: true,
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
