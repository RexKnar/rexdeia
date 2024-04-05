import { db } from 'lib/db';

type SubjectsWithFormatFilter = {
  examId: string;
  classId: string;
  sectionId: string;
};

export async function getSubjectsWithFormat(filter: SubjectsWithFormatFilter) {
  return db.academicExams.findMany({
    where: {
      isDeleted: false,
      ...filter,
    },
    select: {
      subject: {
        select: {
          name: true,
          id: true,
        },
      },
      examConfiguration: {
        where: {
          NOT: {
            assessmentFormat: null,
          },
        },
        select: {
          assessmentFormat: true,
        },
      },
    },
  });
}

export async function createMarkEntry(examPayload) {
  const { mark, absent, studentId, assessmentFormatId, academicExamsId } =
    examPayload;

  return await db.markEntry.create({
    data: {
      mark: mark,
      absent: absent,
      student: {
        connect: {
          id: studentId,
        },
      },
      assessmentFormat: {
        connect: {
          id: assessmentFormatId,
        },
      },
      academicExams: {
        connect: {
          id: academicExamsId,
        },
      },
    },
  });
}
