import { authOptions } from 'lib/auth';
import { getServerSession } from 'next-auth';

import { db } from '../../../lib/db';
import { CreateExamModel } from '../../../lib/domain/exam';

export async function createExam(payload: CreateExamModel) {
  const {
    name,
    termId,
    batchId,
    classId,
    sectionId,
    subjectId,
    examTypeId,
    configuration,
  } = payload;

  const { minMark, maxMark, dateToConduct, markToConduct } = configuration;

  const [term, batch, classData, subject, section, examType] =
    await db.$transaction([
      db.term.findUnique({ where: { id: termId } }),
      db.batch.findUnique({ where: { id: batchId } }),
      db.class.findUnique({ where: { id: classId } }),
      db.subject.findUnique({ where: { id: subjectId } }),
      db.section.findUnique({ where: { id: sectionId } }),
      db.examType.findUnique({ where: { id: examTypeId } }),
    ]);

  if (classData) {
    throw new Error(`CLASS_NOT_MATCHED`);
  }

  if (subject) {
    throw new Error(`SUBJECT_NOT_FOUND`);
  }

  if (!term) {
    throw new Error(`TERM_NOT_FOUND`);
  }

  if (!section) {
    throw new Error(`SECTION_NOT_FOUND`);
  }

  if (!examType) {
    throw new Error(`EXAM_TYPE_NOT_FOUND`);
  }

  if (!batch) {
    throw new Error(`BATCH_NOT_FOUND`);
  }

  const session = await getServerSession(authOptions);

  return db.exam.create({
    data: {
      name: name,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
      batch: {
        connect: {
          id: batch.id,
        },
      },
      term: {
        connect: {
          id: term.id,
        },
      },
      section: {
        connect: {
          id: section.id,
        },
      },
      examType: {
        connect: {
          id: examType.id,
        },
      },
      examConfiguration: {
        create: {
          minMark,
          maxMark,
          markToConduct,
          dateToConduct: new Date(dateToConduct),
          section: {
            connect: {
              id: section.id,
            },
          },
          class: {
            connect: {
              id: classData.id,
            },
          },
          subject: {
            connect: {
              id: subject.id,
            },
          },
        },
      },
    },
  });
}

export async function getExamsList(page: number, limit: number) {
  const session = await getServerSession(authOptions);
  const [data, total] = await Promise.all([
    db.exam.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        branchId: session.branchId,
      },
      include: {
        examConfiguration: true,
        term: true,
        batch: true,
        branch: true,
        section: true,
        examType: true,
        examGroup: true,
      },
    }),
    db.exam.count({
      where: {
        branchId: session.branchId,
      },
    }),
  ]);

  return {
    page,
    total,
    limit,
    data,
  };
}
