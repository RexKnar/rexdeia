import { db } from 'lib/db';

type MarkAnalyticsFilter = {
  classId?: string;
  sectionId?: string;
  examId?: string;
};

export async function getExamAnalyticsByClass(filter: MarkAnalyticsFilter) {
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
                  select: {
                    subject: true,
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
    }),
  ]);
  let subjectCount = 0;
  const markList = studentList.map((student) => {
    const studentDetail = { ...student.student };
    const studentId = studentDetail.id;
    const [{ examSubject }] = student.section.ExamGroup;
    let subjectPassed = 0;
    let subjectFailed = 0;
    let studentTotalMark = 0;

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
          if (
            Number(mark.mark) < Number(partition.minMark) ||
            mark.attandance
          ) {
            failingStatus = true;
            failingOn.push(partition.assessmentFormat.name);
          }
          if (mark.attandance) {
            absentStatus = true;
            absentOn.push(partition.assessmentFormat.name);
          }

          const actualMark =
            (Number(mark.mark) / Number(partition.totalMarks)) *
              Number(partition.convertTo) || 0;
          subjectTotalMark = subjectTotalMark + Math.round(actualMark);
          mark['total'] = Math.round(actualMark);

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
      studentTotalMark += subjectTotalMark;
      const subject = {
        ...examSubject.subject,
        marks,
        subjectTotalMark: Math.round(subjectTotalMark),
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
    studentDetail['totalMark'] = studentTotalMark;
    studentDetail['subjects'] = subjects;
    studentDetail['subjectPassed'] = subjectPassed;
    studentDetail['subjectFailed'] = subjectFailed;
    studentDetail['failingStatus'] = subjectFailed > 0 ? true : false;

    return studentDetail;
  });
  const findMinMaxTotalMarks = (students) => {
    let highestTotalMark = -Infinity;
    let lowestTotalMark = Infinity;
    let highestByGender = {};
    let lowestByGender = {};
    let highestStudent = null;
    let lowestStudent = null;
    let highestStudentByGender = {};
    let lowestStudentByGender = {};

    let totalPassCount = 0;
    let malePassCount = 0;
    let femalePassCount = 0;

    let totalFailCount = 0;
    let maleFailCount = 0;
    let femaleFailCount = 0;

    let totalAbsentCount = 0;
    let maleAbsentCount = 0;
    let femaleAbsentCount = 0;

    students.forEach((student) => {
      const totalMarks = student.subjects.reduce(
        (total, subject) => total + subject.subjectTotalMark,
        0
      );

      if (totalMarks > highestTotalMark) {
        highestTotalMark = totalMarks;
        highestStudent = student;
      }
      if (totalMarks < lowestTotalMark) {
        lowestTotalMark = totalMarks;
        lowestStudent = student;
      }

      const gender = student.gender;
      if (!highestByGender[gender] || highestByGender[gender] < totalMarks) {
        highestByGender[gender] = totalMarks;
        highestStudentByGender[gender] = { ...student, totalMarks };
      }
      if (!lowestByGender[gender] || lowestByGender[gender] > totalMarks) {
        lowestByGender[gender] = totalMarks;
        lowestStudentByGender[gender] = { ...student, totalMarks };
      }

      const isFailing = student.subjects.some(
        (subject) => subject.failingStatus
      );
      const isAbsent = student.subjects.some((subject) => subject.absentStatus);

      if (isFailing) {
        totalFailCount++;
        if (gender.toLowerCase() === 'male') {
          maleFailCount++;
        } else if (gender.toLowerCase() === 'female') {
          femaleFailCount++;
        }
      } else {
        totalPassCount++;
        if (gender.toLowerCase() === 'male') {
          malePassCount++;
        } else if (gender.toLowerCase() === 'female') {
          femalePassCount++;
        }
      }

      if (isAbsent) {
        totalAbsentCount++;
        if (gender.toLowerCase() === 'male') {
          maleAbsentCount++;
        } else if (gender.toLowerCase() === 'female') {
          femaleAbsentCount++;
        }
      }
    });

    const totalStudents = totalPassCount + totalFailCount;

    const malePassPercentage = (malePassCount / totalPassCount) * 100;
    const femalePassPercentage = (femalePassCount / totalPassCount) * 100;
    const maleFailPercentage = (maleFailCount / totalFailCount) * 100;
    const femaleFailPercentage = (femaleFailCount / totalFailCount) * 100;
    const totalPassPercentage = (totalPassCount / totalStudents) * 100;
    const totalFailPercentage = (totalFailCount / totalStudents) * 100;

    return {
      highestTotalMark,
      lowestTotalMark,
      highestByGender,
      lowestByGender,
      highestStudent,
      lowestStudent,
      highestStudentByGender,
      lowestStudentByGender,
      totalPassCount,
      malePassCount,
      femalePassCount,
      totalFailCount,
      maleFailCount,
      femaleFailCount,
      totalAbsentCount,
      maleAbsentCount,
      femaleAbsentCount,
      malePassPercentage: malePassPercentage.toFixed(2),
      femalePassPercentage: femalePassPercentage.toFixed(2),
      maleFailPercentage: maleFailPercentage.toFixed(2),
      femaleFailPercentage: femaleFailPercentage.toFixed(2),
      totalPassPercentage: totalPassPercentage.toFixed(2),
      totalFailPercentage: totalFailPercentage.toFixed(2),
    };
  };

  const getSubjectCountWiseStatusCount = (students, subjectCount) => {
    let subjectCountWiseStatusCount = [];
    for (let i = 0; i < subjectCount; i++) {
      let malePassCount = 0;
      let femalePassCount = 0;
      let maleFailCount = 0;
      let femaleFailCount = 0;
      students.forEach((student) => {
        if (
          student['subjectPassed'] == i + 1 &&
          student['gender'].toLowerCase() === 'male'
        ) {
          malePassCount += 1;
        }
        if (
          student['subjectPassed'] == i + 1 &&
          student['gender'] == 'female'
        ) {
          femalePassCount += 1;
        }
        if (
          student['subjectFailed'] == i + 1 &&
          student['gender'].toLowerCase() === 'male'
        ) {
          maleFailCount += 1;
        }
        if (
          student['subjectFailed'] == i + 1 &&
          student['gender'].toLowerCase() === 'female'
        ) {
          femaleFailCount += 1;
        }
      });
      subjectCountWiseStatusCount.push({
        subjectCount: `${i + 1} Subject(s)`,
        name: `${i + 1} Subject(s)`,
        maleFailed: maleFailCount,
        femaleFailed: femaleFailCount,
        malePassed: malePassCount,
        femalePassed: femalePassCount,
        totalPassed: malePassCount + femalePassCount,
        totalFailed: maleFailCount + femaleFailCount,
      });
    }

    return subjectCountWiseStatusCount;
  };

  const analytics = findMinMaxTotalMarks(markList);
  const subjectWiseCount = getSubjectCountWiseStatusCount(
    markList,
    subjectCount
  );
  return { analytics, subjectWiseCount, markList };
}
