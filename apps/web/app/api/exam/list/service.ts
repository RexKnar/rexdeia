import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { ExamModel } from 'lib/domain/exam';
import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';

type GetExamsByClassSectionFilter = {
  classId?: string;
  sectionId?: string;
};
export async function getExamsBySectionId(
  filter: GetExamsByClassSectionFilter,
  sessionParam?: any
) {
  const session = sessionParam || (await getServerSession(authOptions));
  let batchId = session?.currentBatch;

  if (!batchId) {
    const activeBatch = await db.batch.findFirst({
      where: { currentAcademicYear: true },
      select: { id: true },
    });
    batchId = activeBatch?.id;
  }

  const whereClause: any = {
    exam: {
      isDeleted: false,
      ...(batchId ? { batchId } : {}),
    },
  };

  if (filter.classId && filter.classId !== 'all') {
    whereClause.classId = filter.classId;
  }
  if (filter.sectionId && filter.sectionId !== 'all') {
    whereClause.sectionId = filter.sectionId;
  }

  const exams = await db.examGroup.findMany({
    where: whereClause,
    select: {
      exam: {
        select: {
          id: true,
          name: true,
          isActive: true,
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

  return uniqBy(examList, (exam: any) => exam.id);
}
