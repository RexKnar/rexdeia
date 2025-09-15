import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

import { getGradeByClassId } from '../grade/service';

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
    | { classId: string; examId: string; sectionId?: string }
) {
  const { classId, examId, sectionId } = filter;
  const { gradeScales } = await getGradeByClassId(classId);
  const session = await getServerSession(authOptions);

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
        onHold: false,
        batchId: session.currentBatch,
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
            id: true,
            name: true,
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
                    minMark: true,
                    totalMarks: true,
                    convertTo: true,
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
          rollNumber: 'asc',
        },
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
    let centumCount = 0;
    let overallAbsentStatus = false;

    const subjects = examSubject.map((examSubject) => {
      const examSubjectPartition = examSubject.examSubjectPartition;

      let subjectTotalMark = 0;
      let conductedSubjectTotalMark = 0;
      let failingStatus = false;
      let failingOn = [];
      let absentStatus = true;

      let absentOn = [];
      let centum = true;

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
              if (!partition.excludeSubjectValidation) {
                failingStatus = true;
              }
              failingOn.push(partition.assessmentFormat.name);
            }
            if (mark.attandance) {
              absentOn.push(partition.assessmentFormat.name);
            } else {
              attendance = true;
            }
            conductedSubjectTotalMark += Number(mark.mark);
            const markValue = Number(mark.mark);
            const totalMarksValue = Number(partition.totalMarks);

            if (!failingStatus && markValue !== totalMarksValue) {
              centum = false;
            }

            const actualMark =
              (Number(mark.mark) / Number(partition.totalMarks)) *
              Number(partition.convertTo);

            subjectTotalMark += Math.round(actualMark);
            mark['total'] = Math.round(actualMark);
            mark['entryStatus'] = true;
            mark['centum'] = centum;
          } else {
            mark['entryStatus'] = false;
            mark['total'] = 0;
          }
          acc.push(mark);
        });

        return acc;
      }, []);

      if (conductedSubjectTotalMark < Number(examSubject.minMark)) {
        failingStatus = true;
      }

      if (failingStatus) {
        subjectFailed++;
      } else {
        subjectPassed++;
      }

      if (marks.length == absentOn.length && marks.length > 0) {
        absentStatus = true;
        overallAbsentStatus = true;
      }
      totalMark += subjectTotalMark;

      let subjectGrade = '';
      if (gradeScales?.length > 0) {
        gradeScales.forEach((gradeScale) => {
          const startValue = Number(gradeScale.startValue);
          const endValue = Number(gradeScale.endValue);

          if (subjectTotalMark >= startValue && subjectTotalMark <= endValue) {
            subjectGrade = gradeScale.gradeName;
          }
        });
      }

      const subject = {
        ...examSubject.subject,
        marks,
        subjectTotalMark,
        absentStatus,
        absentOn,
        failingStatus,
        failingOn,
        centum,
        subjectPassed,
        subjectFailed,
        grade: subjectGrade,
      };

      if (!subject.absentStatus) attendance = true;
      if (!failingStatus && centum) {
        centumCount++;
      }
      return subject;
    });
    subjectCount =
      subjectCount < subjects.length ? subjects.length : subjectCount;
    studentDetail['subjectMasterCount'] = subjectMasters.length;
    studentDetail['subjects'] = subjects;
    studentDetail['centumCount'] = centumCount;
    studentDetail['totalMark'] = totalMark;
    studentDetail['totalAverage'] = totalMark / subjectMasters.length;
    studentDetail['subjectPassed'] = subjectPassed;
    studentDetail['subjectFailed'] = subjectFailed;
    studentDetail['failingStatus'] = subjectFailed > 0 ? true : false;
    studentDetail['totalPercentage'] = (totalMark / actualTotalMarks) * 100;
    studentDetail['overallAbsentStatus'] = overallAbsentStatus;
    studentDetail['attendance'] = attendance;
    studentDetail['section'] = {
      id: student.section.id || null,
      name: student.section.name || null,
    };

    return studentDetail;
  });

  return studentMarkList;
}

export async function getStudentMarksByRank(studentList, classId) {
  const { gradeScales } = await getGradeByClassId(classId);
  // console.log(gradeScales);
  const passedStudents = studentList
    .filter((student) => !student.failingStatus)
    .sort((a, b) => b.totalMark - a.totalMark);

  let rank = 1;
  let prevMark = null;
  let skipRanks = 0;
  let grade = null;

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
    if (gradeScales?.length > 0) {
      gradeScales.forEach((gradeScale) => {
        const startValue = Number(gradeScale.startValue);
        const endValue = Number(gradeScale.endValue);

        if (
          student.totalPercentage >= startValue &&
          student.totalPercentage <= endValue
        ) {
          grade = gradeScale.gradeName;
        }
      });
    }
    return { ...student, rank, grade };
  });

  return rankedStudentList;
}
