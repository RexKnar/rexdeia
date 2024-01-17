import { db } from '../../../lib/db';
import {
  CreateSubjectModel,
  UpdateSubjectModel,
} from '../../../lib/domain/subject';

export async function deleteSubjectById(id: string) {
  return await db.subject.update({
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
  return await db.subject.findFirst({
    where: {
      id: id,
      isActive: true,
    },
  });
}

export async function updateSubjectById(
  id: string,
  updateSubject: UpdateSubjectModel
) {
  return await db.subject.update({
    where: {
      id: id,
    },
    data: {
      ...updateSubject,
    },
  });
}

export async function addSubject(createSubject: CreateSubjectModel) {
  return await db.subject.create({
    data: {
      name: createSubject.name,
      description: createSubject.description,
      isActive: createSubject.isActive,
      type: createSubject.type,
    },
  });
}

export async function getAllSubjectBySectionId(id: string) {
  return await db.subject.findMany({
    where: {
      sectionId: {
        has: id,
      },
      isActive: true,
    },
  });
}

export async function getSubjectList(page: number, limit: number) {
  const [total, subjectList] = await Promise.all([
    db.subject.count(),
    db.subject.findMany({
      where: {
        isActive: true,
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
