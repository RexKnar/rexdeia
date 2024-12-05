import { db } from 'lib/db';

export async function updateStudentRollNumber(
  classId,
  sectionId,
  changedStudents
) {
  try {
    const updatePromises = changedStudents.map((student) =>
      db.studentMapping.update({
        where: {
          id: student.id,
          classId: classId,
          sectionId: sectionId,
          isCurrent: true,
        },
        data: {
          rollNumber: parseInt(student.rollNumber),
        },
      })
    );

    const results = await Promise.all(updatePromises);

    return {
      success: true,
      updatedCount: results.length,
      details: results,
    };
  } catch (error) {
    console.error('Error updating student roll numbers:', error);
    throw new Error('Failed to update student roll numbers');
  }
}
