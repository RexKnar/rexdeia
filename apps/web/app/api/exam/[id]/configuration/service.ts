import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { CreateExamConfigurationModel } from 'lib/domain/exam';
import { getServerSession } from 'next-auth';

export async function createExamConfigurationForExam(
  configuration: CreateExamConfigurationModel,
  examId: string
) {
  const {
    assessmentFormatConfiguration,
    classId,
    sectionId,
    subjectId,
    subjectTypeId,
  } = configuration;

  const [classData, subject, subjectType, section, academicExams] =
    await db.$transaction([
      db.class.findUnique({ where: { id: classId } }),
      db.subject.findUnique({ where: { id: subjectId } }),
      db.subjectType.findUnique({ where: { id: subjectTypeId } }),
      db.section.findUnique({ where: { id: sectionId } }),
      db.academicExams.findFirst({ where: { sectionId, classId, subjectId } }),
    ]);
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

  const createdAcademicExam =
    academicExams ??
    (await db.academicExams.create({
      data: {
        classId: classId,
        examId: examId,
        sectionId: sectionId,
        subjectId: subjectId,
        subjectTypeId: subjectTypeId,
      },
    }));
  return await db.$transaction(async (prisma) => {
    return await Promise.all(
      assessmentFormatConfiguration.map(async (assessmentFormatData) => {
        if (assessmentFormatData.markToConduct)
          await prisma.examConfiguration.create({
            data: {
              assessmentFormatId: assessmentFormatData.assessmentFormatId,
              minPassMark: +assessmentFormatData.minPassMark,
              markToConvert: +assessmentFormatData.markToConvert,
              academicExamId: createdAcademicExam.id,
              dateToConduct: new Date(assessmentFormatData.dateToConduct),
              markToConduct: +assessmentFormatData.markToConduct,
            },
          });
      })
    );
  });
}

export async function getExamConfigurationList(
  page: number,
  limit: number,
  examId: string
) {
  const session = await getServerSession(authOptions);
  const [data, total] = await db.$transaction([
    db.academicExams.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        examId: examId,
      },

      select: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
          },
        },
        examConfiguration: {
          include: {
            assessmentFormat: {
              select: {
                id: true,
                name: true,
              },
            },
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

export async function deleteExamConfigurationEntry(configId: string) {
  return await db.$transaction(async (prisma) => {
    return prisma.examConfiguration.delete({
      where: {
        id: configId,
      },
    });
  });
}
