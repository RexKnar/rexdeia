import { db } from 'lib/db';

type StudentMarksFilter = {
  classId?: string;
  examId?: string;
};

export async function getStudentsByFilter(
  page: number,
  limit: number,
  filter: any
) {
  const { studentId, classId } = filter;

  const whereClause = {};

  if (studentId !== undefined) {
    whereClause['studentId'] = studentId;
  }
  if (classId !== undefined) {
    whereClause['classId'] = classId;
  }

  const [total, studentsList] = await Promise.all([
    db.studentMapping.count({
      where: whereClause,
    }),
    db.studentMapping.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: whereClause,
      select: {
        student: true,
      },
    }),
  ]);

  let male: number = 0;
  let female: number = 0;

  let studentList = studentsList.map((item) => {
    if (item.student.gender === 'male') {
      male++;
    } else if (item.student.gender === 'female') {
      female++;
    }
    return item.student;
  });

  return {
    total,
    page,
    limit,
    male,
    female,
    data: studentList,
  };
}

export async function getMarksByFilter(filter: any) {
  const { academicExamId, classId, examId } = filter;

  const whereClause: StudentMarksFilter = {};

  if (examId !== undefined) {
    whereClause['examId'] = examId;
  }
  if (academicExamId !== undefined) {
    whereClause['academicExamId'] = academicExamId;
  }
  if (classId !== undefined) {
    whereClause['classId'] = classId;
  }
  const [studentsMarks] = await Promise.all([
    db.studentMapping.findMany({
      where: {
        classId: whereClause.classId,
      },
      select: {
        student: {
          select: {
            id: true,
            firstName: true,
          },
        },
        group: {
          select: {
            subjectToGroup: {
              select: {
                subject: {
                  select: {
                    academicExams: {
                      where: { examId: whereClause.examId },
                      select: {
                        markEntry: {
                          select: {
                            mark: true,
                            attandance: true,
                            assessmentFormat: {
                              select: {
                                id: true,
                                name: true,
                              },
                            },
                            student: {
                              select: {
                                id: true,
                                firstName: true,
                              },
                            },
                          },
                        },
                      },
                    },
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  function filterDataByStudentId(data) {
    return data.map((item) => {
      let studentId = item.student.id;
      return {
        studentId: item.student.id,
        studentName: item.student.firstName,
        subjects: item.group.subjectToGroup.map((subject) => {
          const marks = subject.subject.academicExams.flatMap((exam) => {
            return exam.markEntry.filter(
              (mark) => mark.student.id === studentId
            );
          });
          return {
            subjectId: subject.subject.id,
            subjectName: subject.subject.name,
            marks: marks,
          };
        }),
      };
    });
  }

  const studentMarks = filterDataByStudentId(studentsMarks);

  return { studentMarks };
}
