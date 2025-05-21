import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function getStudentsByClassLevelId(classLevelId: string) {
  const session = await getServerSession(authOptions);

  const { branchId } = session;

  const classes = await db.class.findMany({
    where: {
      classLevelId,
      isActive: true,
      branchId,
    },
    select: {
      id: true,
      name: true,
      studentmapping: {
        select: {
          student: {
            select: {
              id: true,
              firstName: true,
              middleName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  const studentList = classes.flatMap((cls) =>
    cls.studentmapping.map((s) => s.student)
  );

  return studentList;
}
