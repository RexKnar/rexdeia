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
  return db.subject.findFirst({
    where: {
      id: id,
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

export async function addSubject(createSubject: CreateSubjectModel) {
  return db.subject.create({
    data: {
      name: createSubject.name,
      description: createSubject.description,
      isActive: createSubject.isActive,
      subjectTypeId: createSubject.subjectTypeId,
      subjectFormatId: createSubject.subjectFormatId,
    },
  });
}

export async function getAllSubjectBySectionId(id: string) {
  return db.subject.findMany({
    where: {
      sectionId: {
        has: id,
      },
      isActive: true,
    },
    include: {
      SubjectType: true,
      SubjectFormat: true,
    },
  });
}

export async function getSubjectList(page: number, limit: number) {
  const [total, subjectList] = await Promise.all([
    db.subject.count(),
    db.subject.findMany({
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
