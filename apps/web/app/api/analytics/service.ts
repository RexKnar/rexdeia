import { db } from 'lib/db';

export async function getStudentsByFilter(
  page: number,
  limit: number,
  filter: any
) {
  const { studentId, classId } = filter;

  const whereClause = {};

  if (studentId !== undefined) {
    whereClause['studentId'] = studentId;
  }
  if (classId !== undefined) {
    whereClause['classId'] = classId;
  }

  const [total, studentsList] = await Promise.all([
    db.studentMapping.count({
      where: { ...whereClause, isCurrent: true },
    }),
    db.studentMapping.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: { ...whereClause, isCurrent: true },
      select: {
        student: true,
      },
    }),
  ]);

  let male: number = 0;
  let female: number = 0;

  let studentList = studentsList.map((item) => {
    if (item.student.gender === 'male') {
      male++;
    } else if (item.student.gender === 'female') {
      female++;
    }
    return item.student;
  });

  return {
    total,
    page,
    limit,
    male,
    female,
    data: studentList,
  };
}
