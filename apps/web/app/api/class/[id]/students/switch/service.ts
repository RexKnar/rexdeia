import { db } from 'lib/db';
import { SwitchStudentsToClassModel } from 'lib/domain/student';

export async function switchStudentToClass(
  classId: string,
  studentPayload: SwitchStudentsToClassModel
) {
  const { studentId } = studentPayload;
  const response = [
    await db.$transaction(async (prisma) => {
      prisma.student.update({
        where: {
          id: studentId,
        },
        data: {
          studentMapping: {
            updateMany: [
              {
                where: {
                  studentId: studentPayload.studentId,
                },
                data: {
                  isCurrent: false,
                },
              },
            ],
          },
        },
      });

      prisma.student.update({
        where: {
          id: studentId,
        },
        data: {
          studentMapping: {
            create: [
              {
                groupId: studentPayload.groupId,
                classId: classId,
                sectionId: studentPayload.sectionId,
                batchId: studentPayload.academicYear,
              },
            ],
          },
        },
      });
    }),
  ];
  return response.flat();
}
