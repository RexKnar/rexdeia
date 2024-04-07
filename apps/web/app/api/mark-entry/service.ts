import { db } from 'lib/db';
import { AddMarkEntryModel } from 'lib/domain/mark-entry';
import uniqBy from 'lodash/uniqBy';

type SubjectsWithFormatFilter = {
  examId: string;
  classId: string;
  sectionId: string;
};
type GetStudentsFilter = {
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
      id: true,
      subject: {
        select: {
          name: true,
          id: true,
        },
      },
      examConfiguration: {
        select: {
          minPassMark: true,
          markToConduct: true,
          markToConvert: true,
          assessmentFormat: true,
        },
      },
    },
  });
}

export async function createMarkEntry(examPayload: AddMarkEntryModel) {
  return await db.$transaction(async (prisma) => {
    await Promise.all(
      examPayload.studentsMarkDetails.map(async (studentMark) => {
        return prisma.markEntry.create({
          data: {
            studentId: studentMark.studentId,
            mark: studentMark.mark,
            attandance: studentMark.attendance,
            staffId: examPayload.staffId,
            academicExamId: studentMark.academicExamId,
            assessmentFormatId: studentMark.assessmentFormatId,
          },
        });
      })
    );
  });
}

export async function getStudentsByClassSection(filter: GetStudentsFilter) {
  const students = await db.studentMapping.findMany({
    where: {
      ...filter,
    },
    select: {
      student: {
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
      },
    },
  });
  return uniqBy(students, (students) => students.student.id);
}
