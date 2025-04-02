import { getStudentMarksByFilter } from 'app/api/analytics/service';
import { getExamSubjectsByClassSectionId } from 'app/api/exam/[id]/subject/service';
import { getAllSectionsByClassId } from 'app/api/section/service';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

import { calculatePercentage } from '../service';

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

  const staffList = await getStaffListByClass(classId);

  const examSubjectList = await getExamSubjectsByClassSectionId(
    examId,
    classId,
    sectionId
  );

  const subjectList = examSubjectList.map((examSubject) => examSubject.subject);

  const studentsMarkList = await getStudentMarksByFilter({
    examId,
    classId,
  });

  if (subjectList?.length > 0) {
    const analytics = await Promise.all(
      staffList.map(async (staffDetail) => {
        const sectionAnalytics = await Promise.all(
          staffDetail.academicSubjects.map(async (academicSubject) => {
            return {
              ...analyzeSubjectPerformance(
                academicSubject?.subject?.id,
                academicSubject?.section?.id,
                studentsMarkList
              ),
              section: academicSubject?.section,
              subject: academicSubject?.subject,
            };
          })
        );

        return {
          analytics: sectionAnalytics,
          ...staffDetail,
        };
      })
    );
    return analytics;
  }

  return [];
}

export async function getStaffListByClass(classId?: string) {
  const sections = await getAllSectionsByClassId(classId);
  const sectionIds = sections.map((x) => x.id);
  const session = await getServerSession(authOptions);

  const staffs = await db.staff.findMany({
    where: {
      academicSubjectForStaff: {
        some: {
          sectionId: {
            in: sectionIds,
          },
          deletedAt: null,
          isIncharge: false,
          academicYearId: session.currentBatch,
        },
      },
    },
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      email: true,
      academicSubjectForStaff: {
        where: {
          sectionId: {
            in: sectionIds,
          },
          deletedAt: null,
          isIncharge: false,
          academicYearId: session.currentBatch,
        },
        orderBy: {
          section: {
            name: 'asc',
          },
        },
        select: {
          isIncharge: true,
          subject: {
            select: {
              name: true,
              id: true,
              subjectMaster: {
                select: {
                  name: true,
                  id: true,
                  order: true,
                },
              },
            },
          },
          academicYear: {
            select: {
              name: true,
              id: true,
            },
          },
          section: {
            select: {
              name: true,
              id: true,
              class: {
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
  });

  const result = staffs
    .map(({ academicSubjectForStaff, ...rest }) => ({
      ...rest,
      academicSubjects: academicSubjectForStaff.sort(
        (a, b) =>
          (a.subject?.subjectMaster?.order || 0) -
          (b.subject?.subjectMaster?.order || 0)
      ),

      sortOrder:
        academicSubjectForStaff[0]?.subject?.subjectMaster?.order ?? Infinity,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // eslint-disable-next-line no-unused-vars
  return result.map(({ sortOrder, ...staffDetails }) => staffDetails);
}

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
    totalMarks: { male: 0, female: 0, overall: 0 },
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
      result.totalMarks[category] = totalMarks[category];
    }
  });

  return result;
}
