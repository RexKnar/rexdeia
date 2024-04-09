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

export async function createMarkEntry(
  assessmentMarksPayload: AddMarkEntryModel
) {
  try {
    const createdMarkEntries = [];

    await db.$transaction(async (prisma) => {
      for (const entry of assessmentMarksPayload.studentsMarkDetails) {
        const { studentId, subjects } = entry;
        for (const studentMark of subjects) {
          const { marks } = studentMark;
          for (const mark of marks) {
            if (mark.mark) {
              const createdMarkEntry = await prisma.markEntry.create({
                data: {
                  studentId,
                  staffId: assessmentMarksPayload.staffId,
                  academicExamId: mark.academicExamId,
                  assessmentFormatId: mark.assessmentFormatId,
                  mark: +mark.mark,
                  attandance: +mark.attendance,
                },
              });
              createdMarkEntries.push(createdMarkEntry);
            }
          }
        }
      }
    });

    return createdMarkEntries;
  } catch (error) {
    console.error('Error creating mark entry:', error);
    throw error;
  }
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
  let studentList = students.map((item) => {
    return item.student;
  });

  return uniqBy(studentList, (student) => student.id);
}
