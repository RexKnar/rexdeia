import { db } from 'lib/db';

export async function getStudentsByFilter(filter: any) {
  const { studentId, classId } = filter;

  const whereClause = {};

  if (studentId !== undefined) {
    whereClause['studentId'] = studentId;
  }
  if (classId !== undefined) {
    whereClause['classId'] = classId;
  }

  const [studentList] = await Promise.all([
    db.studentMapping.findMany({
      where: whereClause,
    }),
  ]);

  return {
    data: studentList,
  };
}

export async function getMarksByFilter(filter: any) {
  const { academicExams, assessmentFormat } = filter;

  const whereClause = {};

  if (academicExams !== undefined) {
    whereClause['academicExams'] = academicExams;
  }
  if (assessmentFormat !== undefined) {
    whereClause['assessmentFormat'] = assessmentFormat;
  }

  const [marks] = await Promise.all([
    db.examConfiguration.findMany({
      where: whereClause,
    }),
  ]);

  return {
    data: marks,
  };
}
