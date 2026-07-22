import { db } from 'lib/db';
import { SwitchStudentsToClassModel } from 'lib/domain/student';

export async function switchStudentToClass(
  studentPayload: SwitchStudentsToClassModel
) {
  const { studentId, groupId, classId, sectionId, academicYear } =
    studentPayload;

  const response = await db.$transaction(async (prisma) => {
    // Step 1: Mark current academic year's student mapping as inactive
    const updateExisting = await prisma.studentMapping.updateMany({
      where: {
        studentId: studentId,
        batchId: academicYear,
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    });

    // Step 2: Create new StudentMapping for current batch & update active section/batch on Student
    const createNew = await prisma.student.update({
      where: { id: studentId },
      data: {
        ...(sectionId && { sectionId }),
        ...(academicYear && { batchId: academicYear }),
        studentMapping: {
          create: [
            {
              groupId,
              classId,
              sectionId,
              batchId: academicYear,
              isCurrent: true,
            },
          ],
        },
      },
    });

    return [updateExisting, createNew];
  });

  return response;
}
