import { Analytics } from 'app/(protected)/analytics/typeDefinition/Analytics';
import { getClassById } from 'app/api/class/service';
import { getExamById } from 'app/api/exam/[id]/service';
import { getExamSubjectsByClassSectionId } from 'app/api/exam/[id]/subject/service';
import { getSectionById } from 'app/api/section/service';

import { getStudentMarksByFilter, getStudentMarksByRank } from '../service';

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

export async function getMasterMarksByFilter(filter: MarkAnalyticsFilter) {
  try {
    const classDetails = await getClassById(filter.classId);
    let sectionDetails = { name: 'All' };
    if (filter.sectionId) {
      sectionDetails = await getSectionById(filter.sectionId);
    }
    const examDetails = await getExamById(filter.examId);
    const studentMarkList = await getStudentMarksByFilter(filter);
    const subjectConfigDetail = await getExamSubjectsByClassSectionId(
      filter.examId,
      filter.classId,
      filter.sectionId
    );

    const rankedStudentList = await getStudentMarksByRank(
      studentMarkList,
      filter.classId
    );
    let finalAnalytics;
    if (subjectConfigDetail?.length > 0) {
      const newAnalytics = new Map<string, Analytics>();

      if (filter.sectionId) {
        const analyticsResults = await Promise.all(
          subjectConfigDetail.map((subject: any) => {
            const analyticsData = analyzeSubjectPerformance(
              studentMarkList,
              subject?.subject?.id,
              subject?.examSubjectPartition?.length ?? 0
            );
            return { ...subject, analyticsData: analyticsData };
          })
        );

        analyticsResults.forEach(({ id, data }) => {
          newAnalytics.set(id, data);
        });

        finalAnalytics = analyticsResults;
      } else {
        finalAnalytics = [];
      }
    }

    return {
      markList: rankedStudentList,
      class: classDetails,
      section: sectionDetails,
      exam: examDetails,
      analytics: finalAnalytics,
    };
  } catch (error) {
    return { markList: [], analytics: {}, error };
  }
}

function analyzeSubjectPerformance(
  students,
  subjectId: string,
  partitionCount: number
): Analytics {
  const result: Analytics = {
    numberOfPassStudents: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    numberOfFailStudents: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    highestMark: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    highestMarkStudentName: {
      male: '',
      female: '',
      overall: '',
      studentList: { male: [], female: [], overall: [] },
    },
    lowestMark: {
      male: Infinity,
      female: Infinity,
      overall: Infinity,
      studentList: { male: [], female: [], overall: [] },
    },
    lowestMarkStudentName: {
      male: '',
      female: '',
      overall: '',
      studentList: { male: [], female: [], overall: [] },
    },
    averageMark: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    averageMarkAppeared: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    passPercentage: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    failPercentage: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    passPercentageExcludingAbsent: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    failPercentageExcludingAbsent: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    attendance: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    absent: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    markEntry: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    totalStudents: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
    centum: {
      male: 0,
      female: 0,
      overall: 0,
      studentList: { male: [], female: [], overall: [] },
    },
  };

  let totalMarks = { male: 0, female: 0, overall: 0 };
  let totalStudents = { male: 0, female: 0, overall: 0 };
  students.forEach((student) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { subjects: studentSubjects, ...rest } = student;
    const subject = studentSubjects.find((subj) => subj.id === subjectId);
    // console.log(subjectData, subject, studentSubjects);
    if (!subject) return;

    const gender = student.gender.toLowerCase() === 'male' ? 'male' : 'female';
    const mark = subject.subjectTotalMark || 0;
    const studentFullName =
      `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim();

    result.totalStudents[gender]++;
    result.totalStudents.overall++;
    totalMarks[gender] += mark;
    totalMarks.overall += mark;
    totalStudents[gender]++;
    result.totalStudents.studentList[gender].push(student);
    totalStudents.overall++;

    if (!subject.absentStatus && subject?.marks?.length > 0) {
      result.attendance[gender]++;
      result.attendance.overall++;
      result.attendance.studentList.overall.push(student);
      result.attendance.studentList[gender].push(student);
    } else if (subject.absentStatus && subject?.marks?.length > 0) {
      result.absent[gender]++;
      result.absent.overall++;
      result.absent.studentList.overall.push(student);
      result.absent.studentList[gender].push(student);
    }
    if (subject?.marks?.length === 0) {
      result.markEntry[gender]++;
      result.markEntry.overall++;
      result.markEntry.studentList.overall.push(student);
      result.markEntry.studentList[gender].push(student);
    }

    if (mark > result.highestMark[gender]) {
      result.highestMark[gender] = mark;
      result.highestMarkStudentName[gender] = studentFullName;

      result.highestMark.studentList[gender] = [student];
    }
    if (mark < result.lowestMark[gender] && !subject.absentStatus) {
      result.lowestMark[gender] = mark;
      result.lowestMarkStudentName[gender] = studentFullName;

      result.lowestMark.studentList[gender] = [student];
    }

    if (mark > result.highestMark['overall']) {
      result.highestMark['overall'] = mark;
      result.highestMarkStudentName['overall'] = studentFullName;
      result.highestMark.studentList.overall = [student];
    }
    if (mark < result.lowestMark['overall'] && !subject.absentStatus) {
      result.lowestMark['overall'] = mark;
      result.lowestMarkStudentName['overall'] = studentFullName;
      result.lowestMark.studentList.overall = [student];
    }

    if (subject.failingStatus && !subject.absentStatus) {
      result.numberOfFailStudents[gender]++;
      result.numberOfFailStudents.overall++;
      result.numberOfFailStudents.studentList.overall.push(student);
      result.numberOfFailStudents.studentList[gender].push(student);
    } else if (!subject.failingStatus && !subject.absentStatus) {
      result.numberOfPassStudents[gender]++;
      result.numberOfPassStudents.overall++;
      result.numberOfPassStudents.studentList.overall.push(student);
      result.numberOfPassStudents.studentList[gender].push(student);
    }

    if (
      subject.centum &&
      !subject.failingStatus &&
      !subject.absentStatus &&
      subject?.marks?.length === partitionCount
    ) {
      result.centum[gender]++;
      result.centum.overall++;
      result.centum.studentList.overall.push(student);
      result.centum.studentList[gender].push(student);
    }
  });

  ['male', 'female', 'overall'].forEach((category) => {
    if (totalStudents[category] > 0) {
      result.averageMark[category] =
        totalMarks[category] / totalStudents[category];
      result.averageMarkAppeared[category] =
        totalMarks[category] / totalStudents[category] -
        result.absent[category];
      result.lowestMark[category] =
        result.lowestMark[category] === Infinity
          ? 0
          : result.lowestMark[category];
      result.passPercentageExcludingAbsent[category] = calculatePercentage(
        result.numberOfPassStudents[category],
        result?.attendance[category]
      );
      result.failPercentageExcludingAbsent[category] = calculatePercentage(
        result.numberOfFailStudents[category],
        result?.attendance[category]
      );

      result.passPercentage[category] = calculatePercentage(
        result.numberOfPassStudents[category],
        totalStudents[category]
      );
      result.failPercentage[category] = calculatePercentage(
        result.numberOfFailStudents[category],
        totalStudents[category]
      );
    }
  });

  return result;
}
const calculatePercentage = (part: number, whole: number) =>
  whole > 0 ? (part / whole) * 100 : 0;
