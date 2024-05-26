import { db } from 'lib/db';

type CreateExamConfigModel = {
  classId: string;
  sectionIds: string[];
  staffId: string;
  subjects: { subjectId: string; groupId: string }[];
  configDetail: {
    minMark: number;
    totalMarks: number;
    convertTo: number;
    dateToConduct: string;
    assessmentFormatId: string;
  }[];
};

export async function createExamConfig(
  configDetails: CreateExamConfigModel,
  examId: string
) {
  const { classId, sectionIds, subjects, configDetail } = configDetails;

  const [classData] = await db.$transaction([
    db.class.findUnique({ where: { id: classId } }),
  ]);
  if (!classData) {
    throw new Error(`CLASS_NOT_MATCHED`);
  }

  for (const sectionId of sectionIds) {
    const existingExamGroup = await db.examGroup.findFirst({
      where: { examId, sectionId, classId },
    });

    const { id: examGroupId } =
      existingExamGroup ??
      (await db.examGroup.create({
        data: {
          classId: classId,
          examId: examId,
          sectionId: sectionId,
        },
      }));

    for (const subject of subjects) {
      const existingExamSubject = await db.examSubject.findFirst({
        where: { subjectId: subject.subjectId, examGroupId },
      });
      const { id: examSubjectId } =
        existingExamSubject ??
        (await db.examSubject.create({
          data: {
            subjectId: subject.subjectId,
            groupId: subject.groupId,
            examGroupId: examGroupId,
          },
        }));

      if (examSubjectId) {
        return await db.$transaction(async (prisma) => {
          return await Promise.all(
            configDetail.map(async (config) => {
              await prisma.examSubjectPartition.create({
                data: {
                  subjectId: subject.subjectId,
                  examSubjectId: examSubjectId,
                  assessmentFormatId: config.assessmentFormatId,
                  minMark: +config.minMark,
                  convertTo: +config.convertTo,
                  totalMarks: +config.totalMarks,
                  examGroupId: examGroupId,
                  dateToConduct: new Date(config.dateToConduct),
                },
              });
            })
          );
        });
      }
    }
  }
}
