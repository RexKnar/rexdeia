import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function getStudentsByFilter(filter: any) {
  const { studentId, classId } = filter;
  const { branchId } = await getServerSession(authOptions);

  const whereClause = {
    branchId,
    isDeleted: false,
  };

  if (studentId !== undefined) {
    whereClause['studentId'] = studentId;
  }
  if (classId !== undefined) {
    whereClause['isActive'] = classId;
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

// export async function getMarksByFilter(filter: any) {
//   const { classId } = filter;
//   const { branchId } = await getServerSession(authOptions);

//   const whereClause = {
//     branchId,
//     isDeleted: false,
//   };

//   if (classId !== undefined) {
//     whereClause['isActive'] = classId;
//   }

//   const [studentList] = await Promise.all([
//     db.studentMapping.findMany({
//       where: whereClause,
//     }),
//   ]);

//   return {
//     data: studentList,
//   };
// }
