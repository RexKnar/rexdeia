import { authOptions } from 'lib/auth';
import { CreateExamConfigurationModel } from 'lib/domain/exam';
import { getServerSession } from 'next-auth';

import { db } from '../../../lib/db';

export async function getExamsList(page: number, limit: number) {
  const session = await getServerSession(authOptions);
  const [data, total] = await db.$transaction([
    db.exam.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        branchId: session.branchId,
      },
      include: {
        class: true,
        subject: true,
        examType: true,
        section: true,
        batch: true,
        examConfiguration: {
          include: {
            assessmentFormat: true,
          },
        },
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

export async function createExamConfigurationForExam(
  configuration: CreateExamConfigurationModel
) {
  const session = await getServerSession(authOptions);
  const {
    assessmentFormatConfiguration,
    name,
    classId,
    sectionId,
    subjectId,
    subjectTypeId,
    academicYearId,
    examTypeId,
  } = configuration;

  const [examType, classData, subject, subjectType, section, academicYear] =
    await db.$transaction([
      db.examType.findUnique({ where: { id: examTypeId } }),
      db.class.findUnique({ where: { id: classId } }),
      db.subject.findUnique({ where: { id: subjectId } }),
      db.subjectType.findUnique({ where: { id: subjectTypeId } }),
      db.section.findUnique({ where: { id: sectionId } }),
      db.batch.findUnique({ where: { id: academicYearId } }),
    ]);

  if (!examType) {
    throw new Error(`EXAM_NOT_FOUND`);
  }
  if (!classData) {
    throw new Error(`CLASS_NOT_MATCHED`);
  }
  if (!subject) {
    throw new Error(`SUBJECT_NOT_FOUND`);
  }
  if (!section) {
    throw new Error(`SECTION_NOT_FOUND`);
  }
  if (!subjectType) {
    throw new Error(`SUBJECT_TYPE_NOT_FOUND`);
  }
  if (!academicYear) {
    throw new Error(`ACADEMIC_YEAR_NOT_FOUND`);
  }

  return await db.$transaction(async (prisma) => {
    const createdExam = await prisma.exam.create({
      data: {
        name: name,
        isActive: true,
        branch: {
          connect: {
            id: session.branchId,
          },
        },
        examType: {
          connect: {
            id: examTypeId,
          },
        },
        class: {
          connect: {
            id: classId,
          },
        },
        section: {
          connect: {
            id: sectionId,
          },
        },
        subject: {
          connect: {
            id: subjectId,
          },
        },
        batch: {
          connect: {
            id: academicYearId,
          },
        },
      },
    });

    await Promise.all(
      assessmentFormatConfiguration.map(async (assessmentFormatData) => {
        await prisma.examConfiguration.create({
          data: {
            assessmentFormatId: assessmentFormatData.assessmentFormatId,
            minPassMark: assessmentFormatData.minPassMark,
            markToConvert: assessmentFormatData.markToConvert,
            examId: createdExam.id,
            dateToConduct: assessmentFormatData.dateToConduct,
            markToConduct: assessmentFormatData.markToConduct,
          },
        });
      })
    );

    return createdExam;
  });
}
