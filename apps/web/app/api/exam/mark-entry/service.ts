import { db } from 'lib/db';
import { ExamModel } from 'lib/domain/exam';
import { EnterMarkEntryModel } from 'lib/domain/mark-entry';
import uniqBy from 'lodash/uniqBy';

type GetExamsByClassSectionFilter = {
  classId: string;
  sectionId: string;
};
export async function getExamsByClassSection(
  filter: GetExamsByClassSectionFilter
) {
  const exams = await db.academicExams.findMany({
    where: {
      ...filter,
    },
    select: {
      exam: {
        select: {
          id: true,
          name: true,
          term: {
            select: {
              id: true,
              name: true,
            },
          },
          batch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const examList = exams.map((item) => item.exam);

  return uniqBy(examList, (exam: ExamModel) => exam.id);
}

export async function newMarkEntry(markEntryPayload: EnterMarkEntryModel) {
  try {
    const createdMarkEntries = await db.$transaction(async (prisma) => {
      const promises = [];

      for (const entry of markEntryPayload.studentsMarkDetails) {
        const { studentId, subjects } = entry;
        for (const studentMark of subjects) {
          const { marks } = studentMark;
          for (const mark of marks) {
            if (mark.mark || mark.attendance) {
              const where = { id: mark?.id };
              const data = {
                studentId: studentId,
                staffId: markEntryPayload.staffId,
                examSubjectId: studentMark.examSubjectId,
                subjectId: studentMark.subjectId,
                assessmentFormatId: mark.assessmentFormatId,
                examSubjectPartitionId: mark.examPartitionId,
                mark: +mark.mark,
                attandance: +mark.attendance,
              };
              const promise = mark.id
                ? prisma.mark.update({ where, data })
                : prisma.mark.create({ data });
              promises.push(promise);
            }
          }
        }
      }

      return Promise.all(promises);
    });

    return createdMarkEntries.flat();
  } catch (error) {
    console.error('Error creating mark entry:', error);
    throw error;
  }
}
