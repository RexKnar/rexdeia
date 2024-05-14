import { db } from 'lib/db';
import { ExamModel } from 'lib/domain/exam';
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
