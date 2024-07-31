import { db } from 'lib/db';
import { sortByRank } from 'lib/utils/sort';

export type MarkAnalyticsFilterModel = {
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
export async function getStudentMarksByFilter(
  filter:
    | MarkAnalyticsFilterModel
    | { classId: string; examId: string; sectionId: string }
) {
  const { classId, examId, sectionId } = filter;
  const mainClause = {};
  if (sectionId) {
    mainClause['sectionId'] = sectionId;
  }
  if (classId) {
    mainClause['classId'] = classId;
  }

  const [studentList] = await Promise.all([
    db.studentMapping.findMany({
      where: {
        ...mainClause,
        isCurrent: true,
      },
      select: {
        student: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            gender: true,
            id: true,
          },
        },
        section: {
          select: {
            ExamGroup: {
              where: {
                examId,
              },
              select: {
                exam: true,
                examSubject: {
                  orderBy: {
                    subject: {
                      subjectOrder: 'asc',
                    },
                  },
                  select: {
                    subject: true,
                    examSubjectPartition: {
                      include: {
                        Mark: true,
                        assessmentFormat: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        class: true,
      },
      orderBy: [
        {
          student: {
            gender: 'asc',
          },
        },
        {
          student: {
            firstName: 'asc',
          },
        },
      ],
    }),
  ]);

  let subjectCount = 0;
  const studentMarkList = studentList.map((student) => {
    const studentDetail = { ...student.student };
    const studentId = studentDetail.id;
    const [{ examSubject }] = student.section.ExamGroup;
    let subjectPassed = 0;
    let subjectFailed = 0;
    let totalMark = 0;
    let actualTotalMarks = 0;
    let subjectMasters = [];
    let attendance = false;

    const subjects = examSubject.map((examSubject) => {
      const examSubjectPartition = examSubject.examSubjectPartition;

      let subjectTotalMark = 0;
      let failingStatus = false;
      let failingOn = [];
      let absentStatus = true;
      let absentOn = [];

      if (!subjectMasters.includes(examSubject.subject.subjectMasterId)) {
        subjectMasters.push(examSubject.subject.subjectMasterId);
      }
      const marks = examSubjectPartition.reduce((acc, partition) => {
        const subjectMarks = partition.Mark.filter(
          (subjectMark) => subjectMark.studentId === studentId
        );
        actualTotalMarks += Number(partition.convertTo);

        subjectMarks.forEach((mark) => {
          if (mark) {
            absentStatus = false;
            if (
              Number(mark.mark) < Number(partition.minMark) ||
              mark.attandance
            ) {
              failingStatus = true;
              failingOn.push(partition.assessmentFormat.name);
            }
            if (mark.attandance) {
              absentOn.push(partition.assessmentFormat.name);
            } else {
              attendance = true;
            }
            const actualMark =
              (Number(mark.mark) / Number(partition.totalMarks)) *
              Number(partition.convertTo);
            subjectTotalMark += Math.round(actualMark);
            mark['total'] = Math.round(actualMark);
            mark['entryStatus'] = true;
          } else {
            mark['entryStatus'] = false;
            mark['total'] = 0;
          }
          acc.push(mark);
        });

        return acc;
      }, []);

      if (failingStatus) {
        subjectFailed++;
      } else {
        subjectPassed++;
      }

      if (marks.length == absentOn.length) {
        absentStatus = true;
      }
      totalMark += subjectTotalMark;

      const subject = {
        ...examSubject.subject,
        marks,
        subjectTotalMark,
        absentStatus,
        absentOn,
        failingStatus,
        failingOn,
        subjectPassed,
        subjectFailed,
      };

      if (!subject.absentStatus) attendance = true;

      return subject;
    });
    subjectCount =
      subjectCount < subjects.length ? subjects.length : subjectCount;
    studentDetail['subjectMasterCount'] = subjectMasters.length;
    studentDetail['subjects'] = subjects;
    studentDetail['totalMark'] = totalMark;
    studentDetail['totalAverage'] = totalMark / subjectMasters.length;
    studentDetail['subjectPassed'] = subjectPassed;
    studentDetail['subjectFailed'] = subjectFailed;
    studentDetail['failingStatus'] = subjectFailed > 0 ? true : false;
    studentDetail['totalPercentage'] = (totalMark / actualTotalMarks) * 100;
    studentDetail['attendance'] = attendance;

    return studentDetail;
  });

  return studentMarkList;
}

export async function getStudentMarksByRank(studentList) {
  const passedStudents = studentList
    .filter((student) => !student.failingStatus)
    .sort((a, b) => b.totalMark - a.totalMark);

  let rank = 1;
  let prevMark = null;
  let skipRanks = 0;

  const rankList = passedStudents.map((student) => {
    if (student.totalMark !== prevMark) {
      rank = rank + skipRanks;
      skipRanks = 1;
    } else {
      skipRanks++;
    }
    prevMark = student.totalMark;
    return { ...student, rank };
  });

  const rankedStudentList = studentList.map((student) => {
    const rank = rankList.find((s) => s.id === student.id)?.rank || 0;
    return { ...student, rank };
  });

  return rankedStudentList.sort(sortByRank);
}
