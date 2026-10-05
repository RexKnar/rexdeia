import { db } from 'lib/db';

export async function enterMark(markEntryPayload: any, userId: string) {
  try {
    const createMarks = [];

    let updatedCount = 0;
    for (const entry of markEntryPayload.studentsMarkDetails) {
      const hasMark =
        entry.mark !== undefined && entry.mark !== null && entry.mark !== '';
      const hasAttendance =
        entry.attendance !== undefined &&
        entry.attendance !== null &&
        entry.attendance !== '';

      if (hasMark || hasAttendance) {
        const data = {
          studentId: entry.studentId,
          userId: userId,
          examSubjectId: entry.examSubjectId,
          subjectId: entry.subjectId,
          assessmentFormatId: entry.assessmentFormatId,
          examSubjectPartitionId: entry.examSubjectPartitionId,
          mark: hasMark ? +entry.mark : null,
          attandance: hasAttendance ? (entry.attendance ? 1 : 0) : null,
        };
        if (entry.id) {
          await db.mark.update({
            where: { id: entry.id },
            data: data,
          });
          updatedCount++;
        } else {
          const result = await db.mark.createMany({
            data: data,
          });
          if (result.count === 1) createMarks.push(data);
        }
      }
    }

    return {
      success: true,
      createdCount: createMarks.length,
      updatedCount,
    };
  } catch (error) {
    console.error('Error creating mark entry:', error);
    throw error;
  }
}
