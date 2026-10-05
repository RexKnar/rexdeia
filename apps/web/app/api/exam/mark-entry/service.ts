import { db } from 'lib/db';
import { EnterMarkEntryModel } from 'lib/domain/mark-entry';

export async function enterMark(markEntryPayload: EnterMarkEntryModel) {
  try {
    const batchSize = 5000; // Adjust based on your needs and database capabilities
    const createMarks = [];

    for (const entry of markEntryPayload.studentsMarkDetails) {
      const { studentId, subjects } = entry;
      for (const studentMark of subjects) {
        const { marks } = studentMark;
        for (const mark of marks) {
          const hasMark =
            mark.mark !== undefined && mark.mark !== null && mark.mark !== '';
          const hasAttendance =
            mark.attendance !== undefined &&
            mark.attendance !== null &&
            mark.attendance !== '';

          if (hasMark || hasAttendance) {
            const data = {
              studentId: studentId,
              userId: markEntryPayload.userId,
              examSubjectId: studentMark.examSubjectId,
              subjectId: studentMark.subjectId,
              assessmentFormatId: mark.assessmentFormatId,
              examSubjectPartitionId: mark.examPartitionId,
              mark: hasMark ? +mark.mark : null,
              attandance: hasAttendance ? +mark.attendance : null,
            };
            if (mark.id) {
              await db.mark.update({
                where: { id: mark.id },
                data: data,
              });
            } else {
              createMarks.push(data);
            }
          }
        }
      }
    }

    const createdMarkEntries = [];

    for (let i = 0; i < createMarks.length; i += batchSize) {
      const batch = createMarks.slice(i, i + batchSize);
      const result = await db.mark.createMany({
        data: batch,
        skipDuplicates: true,
      });
      createdMarkEntries.push(result);
    }

    return createdMarkEntries;
  } catch (error) {
    console.error('Error creating mark entry:', error);
    throw error;
  }
}
