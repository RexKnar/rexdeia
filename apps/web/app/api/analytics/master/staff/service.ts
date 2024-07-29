import { getExamSubjectsByClassSectionId } from 'app/api/exam/[id]/subject/service';
import { db } from 'lib/db';

export type MarkAnalyticsFilter = {
  classId?: string;
  sectionId?: string;
  examId?: string;
  markRange?: string[];
  filterSubjects?: any[];
  pagination: {
    limit: number;
    page: number;
  };
};

export async function getStaffWiseMarkAnalytics(filter: MarkAnalyticsFilter) {
  const { classId, examId, sectionId } = filter;

  const mainClause = {};
  if (sectionId) {
    mainClause['sectionId'] = sectionId;
  }
  if (classId) {
    mainClause['classId'] = classId;
  }
  const [examGroups] = await Promise.all([
    db.examGroup.findMany({
      where: {
        examId,
        classId,
      },
      select: {
        class: {
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
        exam: true,
        examSubject: {
          orderBy: {
            subject: {
              subjectOrder: 'asc',
            },
          },
          select: {
            subject: {
              select: {
                id: true,
                name: true,
                subjectMasterId: true,
                subjectMaster: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const sections = examGroups.map((examGroup) => {
    return examGroup.section;
  });
  const examSubjectList = await getExamSubjectsByClassSectionId(
    examId,
    classId,
    sectionId
  );

  const subjects = examSubjectList.map((examSubject) => examSubject.subject);

  return { sections, subjects };
}
