import { db } from 'lib/db';

type CreateExamConfigModel = {
  classId: string;
  sectionIds: string[];
  staffId: string;
  subjects: {
    subjectId: string;
    groupId: string;
    subjectMarksToConvert?: string;
    subjectTotalMarks?: string;
  }[];
  configDetail: {
    minMark: number;
    totalMarks: number;
    convertTo: number;
    dateToConduct: string;
    assessmentFormatId: string;
    excludeSubjectValidation: boolean;
  }[];
  subjectTotalMarks: string;
  subjectMarksToConvert: string;
};

export async function createExamConfig(
  configDetails: CreateExamConfigModel,
  examId: string
) {
  const {
    classId,
    sectionIds,
    subjects,
    configDetail,
    subjectTotalMarks,
    subjectMarksToConvert,
  } = configDetails;

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
      const newSubjectTotalMarks = parseInt(subjectTotalMarks) || 0;
      const newSubjectMarksToConvert = parseInt(subjectMarksToConvert) || 0;

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
            totalMarks: newSubjectTotalMarks,
            convertTo: newSubjectMarksToConvert,
          },
        }));

      if (examSubjectId) {
        await Promise.all(
          configDetail.map(async (config) => {
            await db.examSubjectPartition.create({
              data: {
                subjectId: subject.subjectId,
                examSubjectId: examSubjectId,
                assessmentFormatId: config.assessmentFormatId,
                minMark: +config.minMark,
                convertTo: +config.convertTo,
                totalMarks: +config.totalMarks,
                examGroupId: examGroupId,
                dateToConduct: new Date(config.dateToConduct),
                excludeSubjectValidation: config.excludeSubjectValidation,
              },
            });
          })
        );
      }
    }
  }

  return { success: true };
}

export async function editExamPartition(config: any, configId: string) {
  const {
    minMark,
    convertTo,
    totalMarks,
    dateToConduct,
    excludeSubjectValidation,
  } = config;
  return db.examSubjectPartition.update({
    where: {
      id: configId,
    },

    data: {
      minMark: +minMark,
      convertTo: +convertTo,
      totalMarks: +totalMarks,
      dateToConduct: new Date(dateToConduct),
      excludeSubjectValidation: excludeSubjectValidation,
    },
  });
}

export async function deleteExamConfigEntry(configId: string) {
  return await db.examSubjectPartition.delete({
    where: {
      id: configId,
    },
  });
}

export async function getExamPartitionDetailById(configId: string) {
  return await db.examSubjectPartition.findUnique({
    where: {
      id: configId,
    },
  });
}
