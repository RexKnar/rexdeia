import { db } from 'lib/db';

type GetExamConfigFilterModel = {
  examId?: string;
  classId?: string;
  sectionId?: string;
};

export async function getExamConfigWithSubjectPartion(
  filter: GetExamConfigFilterModel
) {
  const { examId, classId, sectionId } = filter;
  const [examConfig] = await Promise.all([
    db.studentMapping.findMany({
      where: {
        classId: classId,
        sectionId: sectionId,
        section: {
          ExamGroup: {
            some: { examId: examId },
          },
        },
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
        section: {
          select: {
            id: true,
            name: true,
            ExamGroup: {
              where: {
                examId: examId,
              },
              select: {
                id: true,
                examId: true,
                examSubject: {
                  select: {
                    id: true,
                    subject: true,
                    examSubjectPartition: {
                      include: {
                        assessmentFormat: true,
                        Mark: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);
  const configResponse = examConfig.map((examData) => {
    const [examGroup] = examData.section.ExamGroup;
    const examSubject = examGroup.examSubject.map((subject) => ({
      ...subject,
      examSubjectPartition: subject.examSubjectPartition.map((partition) => {
        const [mark] = partition.Mark.filter(
          (mark) =>
            mark.studentId === examData.student.id &&
            mark.examSubjectPartitionId === partition.id
        );
        return {
          ...partition,
          Mark: mark || null, // Use the first mark or null if no mark matches
        };
      }),
    }));
    const student = {
      ...examData.student,
      examSubjects: examSubject,
    };
    return student;
  });

  return configResponse;
}

// export async function getFormDataByClassExam(filter: FormDataFilter) {
//   const { classId, examId, sectionId } = filter;

//   const [formData] = await Promise.all([
//     db.studentMapping.findMany({
//       where: {
//         classId: classId,
//         sectionId: sectionId,
//       },
//       select: {
//         student: {
//           select: {
//             id: true,
//             firstName: true,
//           },
//         },
//         group: {
//           include: {
//             subjectToGroup: {
//               where: {
//                 subject: {
//                   academicExams: {
//                     some: {
//                       examId: examId,
//                     },
//                   },
//                 },
//               },
//               select: {
//                 subject: {
//                   select: {
//                     academicExams: {
//                       include: {
//                         examConfiguration: {
//                           select: {
//                             minPassMark: true,
//                             markToConduct: true,
//                             markToConvert: true,
//                             assessmentFormat: true,
//                           },
//                         },
//                       },
//                     },
//                     name: true,
//                     id: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     }),
//   ]);

//   function restructureResponse(data) {
//     return data.map((item) => {
//       return {
//         id: item.student.id,
//         name: item.student.firstName,
//         subjects: item.group.subjectToGroup.map((subject) => {
//           const assessment = subject.subject.academicExams.map((assessment) => {
//             const format = assessment.examConfiguration.map((format) => {
//               return {
//                 academicExamId: assessment.id,
//                 ...format,
//               };
//             });
//             return format;
//           });
//           return {
//             id: subject.subject.id,
//             name: subject.subject.name,
//             assessmentFormat: assessment.flatMap((format) => format),
//           };
//         }),
//       };
//     });
//   }

//   return await restructureResponse(formData);
// }
