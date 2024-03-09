import { db } from '../../../../../lib/db';
import { CreateExamConfigurationModel } from '../../../../../lib/domain/exam';

export async function createExamConfigurationForExam(
  examId: string,
  configuration: CreateExamConfigurationModel
) {
  const { minMark, maxMark, dateToConduct, markToConduct, classId, subjectId } =
    configuration;

  const exam = await db.exam.findUnique({ where: { id: examId } });

  if (!exam) {
    throw new Error(`EXAM_NOT_FOUND`);
  }

  return db.examConfiguration.create({
    data: {
      exam: {
        connect: {
          id: exam.id,
        },
      },
      section: {
        connect: {
          id: exam.sectionId,
        },
      },
      subject: {
        connect: {
          id: subjectId,
        },
      },
      class: {
        connect: {
          id: classId,
        },
      },
      minMark,
      maxMark,
      dateToConduct,
      markToConduct,
    },
  });
}
