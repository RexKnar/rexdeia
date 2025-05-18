import { db } from 'lib/db';

export async function enterMark(markEntryPayload: any, userId: string) {
  try {
    const createMarks = [];

    for (const entry of markEntryPayload.studentsMarkDetails) {
      if (entry.mark || entry.attendance) {
        const data = {
          studentId: entry.studentId,
          userId: userId,
          examSubjectId: entry.examSubjectId,
          subjectId: entry.subjectId,
          assessmentFormatId: entry.assessmentFormatId,
          examSubjectPartitionId: entry.examSubjectPartitionId,
          mark: +entry.mark,
          attandance: entry.attendance ? 1 : 0,
        };
        if (entry.id) {
          await db.mark.update({
            where: { id: entry.id },
            data: data,
          });
        } else {
          const result = await db.mark.createMany({
            data: data,
          });
          if (result.count === 1) createMarks.push(data);
        }
      }
    }

    const createdMarkEntries = [];

    return createdMarkEntries;
  } catch (error) {
    console.error('Error creating mark entry:', error);
    throw error;
  }
}
