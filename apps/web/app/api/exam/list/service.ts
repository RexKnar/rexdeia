import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { ExamModel } from 'lib/domain/exam';
import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';

type GetExamsByClassSectionFilter = {
  classId: string;
  sectionId: string;
};
export async function getExamsBySectionId(
  filter: GetExamsByClassSectionFilter
) {
  const session = await getServerSession(authOptions);
  const exams = await db.examGroup.findMany({
    where: {
      ...filter,
      exam: {
        batch: {
          id: session.currentBatch,
        },
      },
    },
    select: {
      exam: {
        select: {
          id: true,
          name: true,
          markEntryCorrectionDate: true,
          markEntryEndDate: true,
          markEntryOpenDate: true,
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
