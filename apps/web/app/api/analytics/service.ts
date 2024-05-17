import { db } from 'lib/db';

// type StudentMarksFilter = {
//   classId?: string;
//   examId?: string;
// };

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
  const studentMarks = await restructureResponse(studentsMarks);

  // function findClassAnalytics(studentMarks) {
  //   let subjectAnalyticsMap = {};
  //   let classFirstMark = {
  //     mark: -Infinity,
  //     studentId: '',
  //     studentName: '',
  //   };
  //   let classLastMark = {
  //     mark: Infinity,
  //     studentId: '',
  //     studentName: '',
  //   };

  //   for (const student of studentMarks) {
  //     let studentTotalMarks = 0;

  //     for (const subject of student.subjects) {
  //       const { name: subjectName, assessmentFormat: marks } = subject;
  //       const subjectTotalMarks = marks.reduce(
  //         (total, mark) => total + mark.mark,
  //         0
  //       );

  //       if (!subjectAnalyticsMap[subjectName]) {
  //         subjectAnalyticsMap[subjectName] = {
  //           subjectName: subjectName,
  //           highestMark: {
  //             mark: -Infinity,
  //             studentId: '',
  //             studentName: '',
  //           },
  //           lowestMark: {
  //             mark: Infinity,
  //             studentId: '',
  //             studentName: '',
  //           },
  //         };
  //       }

  //       let subjectData = subjectAnalyticsMap[subjectName];

  //       if (subjectTotalMarks > subjectData.highestMark.mark) {
  //         subjectData.highestMark = {
  //           mark: subjectTotalMarks,
  //           studentId: student.id,
  //           studentName: student.name,
  //         };
  //       }

  //       if (subjectTotalMarks < subjectData.lowestMark.mark) {
  //         subjectData.lowestMark = {
  //           mark: subjectTotalMarks,
  //           studentId: student.id,
  //           studentName: student.name,
  //         };
  //       }

  //       studentTotalMarks += subjectTotalMarks;
  //     }

  //     if (studentTotalMarks > classFirstMark.mark) {
  //       classFirstMark = {
  //         mark: studentTotalMarks,
  //         studentId: student.id,
  //         studentName: student.name,
  //       };
  //     }

  //     if (studentTotalMarks < classLastMark.mark) {
  //       classLastMark = {
  //         mark: studentTotalMarks,
  //         studentId: student.id,
  //         studentName: student.name,
  //       };
  //     }
  //   }

  //   let subjectAnalytics = Object.keys(subjectAnalyticsMap).map(
  //     (subjectName) => subjectAnalyticsMap[subjectName]
  //   );

  //   return { subjectAnalytics, classFirstMark, classLastMark };
  // }

  function findClassAnalytics(studentMarks) {
    let subjectAnalyticsMap = {};
    let totalStudents = 0;
    let classFirstMark = { mark: -Infinity, studentId: '', studentName: '' };
    let classLastMark = { mark: Infinity, studentId: '', studentName: '' };

    for (const student of studentMarks) {
      let studentTotalMarks = 0;
      for (const {
        name: subjectName,
        assessmentFormat: marks,
      } of student.subjects) {
        const subjectTotalMarks = marks.reduce(
          (total, { mark }) => total + mark,
          0
        );

        subjectAnalyticsMap[subjectName] = subjectAnalyticsMap[subjectName] || {
          subjectName,
          highestMark: { mark: -Infinity, studentId: '', studentName: '' },
          lowestMark: { mark: Infinity, studentId: '', studentName: '' },
        };

        let subjectData = subjectAnalyticsMap[subjectName];

        if (subjectTotalMarks > subjectData.highestMark.mark) {
          subjectData.highestMark = {
            mark: subjectTotalMarks,
            studentId: student.id,
            studentName: student.name,
          };
        }

        if (subjectTotalMarks < subjectData.lowestMark.mark) {
          subjectData.lowestMark = {
            mark: subjectTotalMarks,
            studentId: student.id,
            studentName: student.name,
          };
        }

        studentTotalMarks += subjectTotalMarks;
      }

      if (studentTotalMarks > classFirstMark.mark) {
        classFirstMark = {
          mark: studentTotalMarks,
          studentId: student.id,
          studentName: student.name,
        };
      }

      if (studentTotalMarks < classLastMark.mark) {
        classLastMark = {
          mark: studentTotalMarks,
          studentId: student.id,
          studentName: student.name,
        };
      }
      totalStudents++;
    }

    let subjectAnalytics = Object.values(subjectAnalyticsMap);

    return { subjectAnalytics, totalStudents, classFirstMark, classLastMark };
  }

  const analytics = findClassAnalytics(studentMarks);

  return { studentMarks, analytics };
}
