import { db } from 'lib/db';
import { SwitchStudentsToClassModel } from 'lib/domain/student';

export async function switchStudentToClass(
  studentPayload: SwitchStudentsToClassModel
) {
  const { studentId, groupId, classId, sectionId, academicYear } =
    studentPayload;

  const response = await db.$transaction(async (prisma) => {
    const updateExisting = await prisma.student.update({
      where: { id: studentId },
      data: {
        studentMapping: {
          updateMany: [
            {
              where: { studentId: studentId },
              data: { isCurrent: false },
            },
          ],
        },
      },
    });

    const createNew = await prisma.student.update({
      where: { id: studentId },
      data: {
        studentMapping: {
          create: [
            {
              groupId,
              classId,
              sectionId,
              batchId: academicYear,
            },
          ],
        },
      },
    });

    return [updateExisting, createNew];
  });

  return response;
}
