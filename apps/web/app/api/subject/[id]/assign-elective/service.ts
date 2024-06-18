import { db } from 'lib/db';

export async function assignElectiveSubjects(
  subjectId: string,
  academicYearId: string,
  payload: any
) {
  const { subjectMasterId } = payload;
  return await db.$transaction(
    payload.studentIds.map((studentId: string) => {
      return db.studentElectiveSubject.create({
        data: {
          subjectId,
          subjectMasterId,
          studentId,
          academicYearId,
        },
      });
    })
  );
}
