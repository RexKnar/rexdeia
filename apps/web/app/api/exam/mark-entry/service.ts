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
        },
      },
    },
  });
  return uniqBy(exams, (exam: ExamModel) => exam.id);
}
