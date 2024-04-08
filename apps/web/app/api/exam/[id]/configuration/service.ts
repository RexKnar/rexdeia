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

  const [classData, subject, subjectType, section] = await db.$transaction([
    db.class.findUnique({ where: { id: classId } }),
    db.subject.findUnique({ where: { id: subjectId } }),
    db.subjectType.findUnique({ where: { id: subjectTypeId } }),
    db.section.findUnique({ where: { id: sectionId } }),
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

  return await db.$transaction(async (prisma) => {
    const createdAcademicExam = await prisma.academicExams.create({
      data: {
        classId: classId,
        examId: examId,
        sectionId: sectionId,
        subjectId: subjectId,
        subjectTypeId: subjectTypeId,
      },
    });

    await Promise.all(
      assessmentFormatConfiguration.map(async (assessmentFormatData) => {
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

    return createdAcademicExam;
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
