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
type GetStaffsFilter = {
  sectionId: string;
};
type FormDataFilter = {
  examId?: string;
  classId?: string;
  sectionId?: string;
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
    const createdMarkEntries = await db.$transaction(async (prisma) => {
      const promises = [];

      for (const entry of assessmentMarksPayload.studentsMarkDetails) {
        const { studentId, subjects } = entry;
        for (const studentMark of subjects) {
          const { marks } = studentMark;
          for (const mark of marks) {
            if (mark.mark) {
              const where = { id: mark.id };
              const data = {
                studentId,
                staffId: assessmentMarksPayload.staffId,
                subject: {
                  connect: [
                    {
                      id: studentMark.subjectId,
                    },
                  ],
                },
                academicExamId: mark.academicExamId,
                assessmentFormatId: mark.assessmentFormatId,
                mark: +mark.mark,
                attandance: +mark.attendance,
              };

              const promise = mark.id
                ? prisma.markEntry.update({ where, data })
                : prisma.markEntry.create({ data });

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

// export async function createMarkEntry(
//   assessmentMarksPayload: AddMarkEntryModel
// ) {
//   try {
//     const createdMarkEntries = [];

//     await db.$transaction(async (prisma) => {
//       for (const entry of assessmentMarksPayload.studentsMarkDetails) {
//         const { studentId, subjects } = entry;
//         for (const studentMark of subjects) {
//           const { marks } = studentMark;
//           for (const mark of marks) {
//             if (mark.mark) {
//               const createdMarkEntry = await prisma.markEntry.create({
//                 data: {
//                   studentId,
//                   staffId: assessmentMarksPayload.staffId,
//                   subject: {
//                     connect: [
//                       {
//                         id: studentMark.subjectId,
//                       },
//                     ],
//                   },
//                   academicExamId: mark.academicExamId,
//                   assessmentFormatId: mark.assessmentFormatId,
//                   mark: +mark.mark,
//                   attandance: +mark.attendance,
//                 },
//               });
//               createdMarkEntries.push(createdMarkEntry);
//             }
//           }
//         }
//       }
//     });

//     return createdMarkEntries;
//   } catch (error) {
//     console.error('Error creating mark entry:', error);
//     throw error;
//   }
// }

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

export async function getStaffsBySection(filter: GetStaffsFilter) {
  const staffs = await db.academicSubjectForStaff.findMany({
    where: {
      ...filter,
    },
    select: {
      staff: {
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
      },
    },
  });
  let staffsList = staffs.map((item) => {
    return item.staff;
  });

  return uniqBy(staffsList, (staff) => staff.id);
}

export async function getStudentsMarksByFilter(filter: any) {
  const { academicExamId, classId, examId } = filter;

  const whereClause = {};

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
        classId: classId,
      },
      select: {
        student: {
          select: {
            id: true,
            firstName: true,
          },
        },
        group: {
          include: {
            subjectToGroup: {
              where: {
                subject: {
                  academicExams: {
                    some: {
                      examId: examId,
                    },
                  },
                },
              },
              select: {
                subject: {
                  select: {
                    academicExams: {
                      include: {
                        examConfiguration: {
                          select: {
                            minPassMark: true,
                            markToConduct: true,
                            markToConvert: true,
                            assessmentFormat: {
                              select: {
                                id: true,
                                name: true,
                                isActive: true,
                                hasMarkEntry: true,
                                markEntry: {
                                  select: {
                                    id: true,
                                    mark: true,
                                    attandance: true,
                                    studentId: true,
                                    staffId: true,
                                    assessmentFormatId: true,
                                    academicExamId: true,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  function restructureResponse(data) {
    return data.map((item) => {
      let studentId = item.student.id;
      return {
        id: item.student.id,
        name: item.student.firstName,
        subjects: item.group.subjectToGroup.map((subject) => {
          const assessment = subject.subject.academicExams.map((assessment) => {
            let formatList = [];
            assessment.examConfiguration.forEach((format) => {
              const academicExamId = assessment.id;
              const assessmentFormatId = format?.assessmentFormat?.id;

              const mark = format.assessmentFormat?.markEntry?.filter(
                (entry) =>
                  entry.studentId === studentId &&
                  entry?.academicExamId === academicExamId &&
                  entry?.assessmentFormatId === assessmentFormatId
              );
              if (mark?.length) {
                formatList.push(mark[0]);
              }
            });
            return formatList;
          });
          return {
            id: subject.subject.id,
            name: subject.subject.name,
            assessmentFormat: assessment.flatMap((format) => format),
          };
        }),
      };
    });
  }
  return await restructureResponse(studentsMarks);
  // const response = restructureResponse(studentsMarks);
  // return { studentsMarks, response };
}

export async function getFormDataByClassExam(filter: FormDataFilter) {
  const { classId, examId, sectionId } = filter;

  const [formData] = await Promise.all([
    db.studentMapping.findMany({
      where: {
        classId: classId,
        sectionId: sectionId,
      },
      select: {
        student: {
          select: {
            id: true,
            firstName: true,
          },
        },
        group: {
          include: {
            subjectToGroup: {
              where: {
                subject: {
                  academicExams: {
                    some: {
                      examId: examId,
                    },
                  },
                },
              },
              select: {
                subject: {
                  select: {
                    academicExams: {
                      include: {
                        examConfiguration: {
                          select: {
                            minPassMark: true,
                            markToConduct: true,
                            markToConvert: true,
                            assessmentFormat: true,
                          },
                        },
                      },
                    },
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  function restructureResponse(data) {
    return data.map((item) => {
      return {
        id: item.student.id,
        name: item.student.firstName,
        subjects: item.group.subjectToGroup.map((subject) => {
          const assessment = subject.subject.academicExams.map((assessment) => {
            const format = assessment.examConfiguration.map((format) => {
              return {
                academicExamId: assessment.id,
                ...format,
              };
            });
            return format;
          });
          return {
            id: subject.subject.id,
            name: subject.subject.name,
            assessmentFormat: assessment.flatMap((format) => format),
          };
        }),
      };
    });
  }

  return await restructureResponse(formData);
}
