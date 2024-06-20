import { db } from 'lib/db';

type MarkAnalyticsFilter = {
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

export async function getMarksByFilter(filter: MarkAnalyticsFilter) {
  const { classId, examId, sectionId, filterSubjects, markRange } = filter;

  let subjectArray = [];
  if (filterSubjects.length) {
    subjectArray = filterSubjects.map((subject) => subject.id);
  }

  let subjectWhere = subjectArray.length ? { id: { in: subjectArray } } : {};

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
                  where: subjectWhere,
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

    const subjects = examSubject.map((examSubject) => {
      const examSubjectPartition = examSubject.examSubjectPartition;

      let subjectTotalMark = 0;
      let failingStatus = false;
      let failingOn = [];
      let absentStatus = false;
      let absentOn = [];

      const marks = examSubjectPartition.reduce((acc, partition) => {
        const subjectMarks = partition.Mark.filter(
          (subjectMark) => subjectMark.studentId === studentId
        );

        subjectMarks.forEach((mark) => {
          if (mark.mark < partition.minMark || mark.attandance) {
            failingStatus = true;
            failingOn.push(partition.assessmentFormat.name);
          }
          if (mark.attandance) {
            absentStatus = true;
            absentOn.push(partition.assessmentFormat.name);
          }

          const actualMark =
            (mark.mark / partition.totalMarks) * partition.convertTo;
          subjectTotalMark += Math.ceil(actualMark);
          mark['total'] = Math.ceil(actualMark);

          acc.push(mark);
        });

        return acc;
      }, []);

      if (failingStatus) {
        subjectFailed++;
      } else {
        subjectPassed++;
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

      return subject;
    });
    subjectCount =
      subjectCount < subjects.length ? subjects.length : subjectCount;

    studentDetail['subjects'] = subjects;
    studentDetail['totalMark'] = totalMark;
    studentDetail['subjectPassed'] = subjectPassed;
    studentDetail['subjectFailed'] = subjectFailed;
    studentDetail['failingStatus'] = subjectFailed > 0 ? true : false;

    return studentDetail;
  });

  const markList = studentMarkList.filter((marks) => {
    if (markRange.length) {
      if (
        marks['totalMark'] > markRange[0] &&
        marks['totalMark'] < markRange[1]
      ) {
        return marks;
      } else {
        return false;
      }
    } else {
      return marks;
    }
  });

  const findMinMaxTotalMarks = (students) => {
    let totalMale = 0;
    let totalFemale = 0;
    let totalCount = students.length || 0;

    students.forEach((student) => {
      const gender = student.gender;

      if (gender === 'Male') {
        totalMale++;
      } else if (gender === 'Female') {
        totalFemale++;
      }
    });

    const totalMalePercentage = (totalMale / totalCount) * 100;
    const totalFemalePercentage = (totalFemale / totalCount) * 100;

    return {
      totalCount,
      totalMale,
      totalFemale,
      totalFemalePercentage,
      totalMalePercentage,
    };
  };

  const analytics = findMinMaxTotalMarks(markList);
  return { markList, analytics };
}
