import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function getAnalyticsSubjectByStaffId(staffId, sectionId) {
  const session = await getServerSession(authOptions);
  const currentBatch = session?.currentBatch;

  const [isIncharge] = staffId
    ? await Promise.all([
        db.academicSubjectForStaff.findFirst({
          where: {
            staffId: staffId,
            isIncharge: true,
            sectionId: sectionId,
            academicYearId: currentBatch,
          },
        }),
      ])
    : [false];

  const subjectResponse = await db.academicSubjectForStaff.findMany({
    where: isIncharge
      ? { academicYearId: currentBatch, isIncharge: false, sectionId }
      : {
          staffId: staffId,
          isIncharge: false,
          academicYearId: currentBatch,
          sectionId,
        },

    select: {
      subject: {
        include: {
          subjectMaster: true,
        },
      },
    },
  });

  const subjects = subjectResponse
    .flatMap((academicSubject) => academicSubject.subject)
    .filter((subject) => subject != null);

  const uniqueSubjects = Array.from(
    new Map(subjects.map((subject) => [subject.id, subject])).values()
  );

  const sortedSubjects = uniqueSubjects.sort((a, b) => {
    return a.subjectMaster.order - b.subjectMaster.order;
  });

  return sortedSubjects;
}
