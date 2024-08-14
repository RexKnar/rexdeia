import { getExamSubjectsByClassSectionId } from 'app/api/exam/[id]/subject/service';
import { getSectionsWithFilter } from 'app/api/section/service';

import { getStudentMarksByFilter } from '../../service';
import { MarkAnalyticsFilter } from '../staff/service';

export async function getMasterMarkComparisonBySection(
  filter: MarkAnalyticsFilter
) {
  const { classId, examId, sectionId } = filter;
  const examSubjectList = await getExamSubjectsByClassSectionId(
    examId,
    classId,
    sectionId
  );

  const { data: sectionList } = await getSectionsWithFilter(classId, {
    isActive: true,
  });

  const subjectList = examSubjectList.map((examSubject) => examSubject.subject);

  const studentsMarkList = await getStudentMarksByFilter({
    examId,
    classId,
  });

  if (subjectList?.length > 0) {
    const analytics = await Promise.all(
      subjectList.map(async (subject) => {
        const sectionAnalytics = await Promise.all(
          sectionList.map(async (section) => {
            return {
              ...analyzeSubjectPerformance(
                subject.id,
                section.id,
                studentsMarkList
              ),
              section,
            };
          })
        );

        return {
          subject,
          analytics: sectionAnalytics,
        };
      })
    );
    return analytics;
  }

  return [];
}
const calculatePercentage = (part: number, whole: number) =>
  whole > 0 ? (part / whole) * 100 : 0;

function analyzeSubjectPerformance(
  subjectId: string,
  sectionId: string,
  studentsMarkList: any[] = []
) {
  const result = {
    numberOfPassStudents: { male: 0, female: 0, overall: 0 },
    numberOfFailStudents: { male: 0, female: 0, overall: 0 },
    highestMark: { male: 0, female: 0, overall: 0 },
    highestMarkStudentName: { male: '', female: '', overall: '' },
    lowestMark: { male: Infinity, female: Infinity, overall: Infinity },
    lowestMarkStudentName: { male: '', female: '', overall: '' },
    averageMark: { male: 0, female: 0, overall: 0 },
    passPercentage: { male: 0, female: 0, overall: 0 },
    failPercentage: { male: 0, female: 0, overall: 0 },
    attendance: { male: 0, female: 0, overall: 0 },
    absent: { male: 0, female: 0, overall: 0 },
    markEntry: { male: 0, female: 0, overall: 0 },
    totalStudents: { male: 0, female: 0, overall: 0 },
  };

  let totalMarks = { male: 0, female: 0, overall: 0 };
  let totalStudents = { male: 0, female: 0, overall: 0 };

  studentsMarkList
    .filter(
      (studentFilter) =>
        studentFilter.section && studentFilter.section.id === sectionId
    )
    .forEach((student) => {
      const subject = student.subjects.find((subj) => subj.id === subjectId);
      if (!subject) return;

      const gender =
        student.gender.toLowerCase() === 'male' ? 'male' : 'female';
      const mark = subject.subjectTotalMark || 0;
      const studentFullName =
        `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim();

      result.totalStudents[gender]++;
      result.totalStudents.overall++;
      totalMarks[gender] += mark;
      totalMarks.overall += mark;
      totalStudents[gender]++;
      totalStudents.overall++;

      if (!subject.absentStatus && subject?.marks?.length > 0) {
        result.attendance[gender]++;
        result.attendance.overall++;
      } else if (subject.absentStatus && subject?.marks?.length > 0) {
        result.absent[gender]++;
        result.absent.overall++;
      }
      if (subject?.marks?.length === 0) {
        result.markEntry[gender]++;
        result.markEntry.overall++;
      }

      if (mark > result.highestMark[gender]) {
        result.highestMark[gender] = mark;
        result.highestMarkStudentName[gender] = studentFullName;
      }
      if (mark < result.lowestMark[gender] && !subject.absentStatus) {
        result.lowestMark[gender] = mark;
        result.lowestMarkStudentName[gender] = studentFullName;
      }

      if (mark > result.highestMark['overall']) {
        result.highestMark['overall'] = mark;
        result.highestMarkStudentName['overall'] = studentFullName;
      }
      if (mark < result.lowestMark['overall'] && !subject.absentStatus) {
        result.lowestMark['overall'] = mark;
        result.lowestMarkStudentName['overall'] = studentFullName;
      }

      if (subject.failingStatus && !subject.absentStatus) {
        result.numberOfFailStudents[gender]++;
        result.numberOfFailStudents.overall++;
      } else if (!subject.failingStatus && !subject.absentStatus) {
        result.numberOfPassStudents[gender]++;
        result.numberOfPassStudents.overall++;
      }
    });

  ['male', 'female', 'overall'].forEach((category) => {
    if (totalStudents[category] > 0) {
      result.averageMark[category] =
        totalMarks[category] / totalStudents[category];
      result.lowestMark[category] =
        result.lowestMark[category] === Infinity
          ? 0
          : result.lowestMark[category];
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
