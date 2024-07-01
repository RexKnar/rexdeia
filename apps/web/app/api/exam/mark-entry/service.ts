import { db } from 'lib/db';
import { EnterMarkEntryModel } from 'lib/domain/mark-entry';

export async function enterMark(markEntryPayload: EnterMarkEntryModel) {
  try {
    const createdMarkEntries = await db.$transaction(async (prisma) => {
      const promises = [];

      for (const entry of markEntryPayload.studentsMarkDetails) {
        const { studentId, subjects } = entry;
        for (const studentMark of subjects) {
          const { marks } = studentMark;
          for (const mark of marks) {
            if (mark.mark || mark.attendance) {
              const where = { id: mark?.id };
              const data = {
                studentId: studentId,
                userId: markEntryPayload.userId,
                examSubjectId: studentMark.examSubjectId,
                subjectId: studentMark.subjectId,
                assessmentFormatId: mark.assessmentFormatId,
                examSubjectPartitionId: mark.examPartitionId,
                mark: +mark.mark,
                attandance: +mark.attendance,
              };
              const promise = mark.id
                ? prisma.mark.update({ where, data })
                : prisma.mark.create({ data });
              promises.push(promise);
            }
          }
        }
      }

      return Promise.all(promises);
    });

    return createdMarkEntries.flat();
  } catch (error) {
    console.error('Error creating mark entry:', error);
    throw error;
  }
}
