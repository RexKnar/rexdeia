import { getSubjectToStudentByGroupAndClassId } from 'app/api/group/[id]/subjects/service';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function getStudentMarksById(
  studentId: string,
  sectionId: string,
  groupId?: string,
  classId?: string
) {
  const session = await getServerSession(authOptions);

  const examData = await db.examGroup.findMany({
    where: {
      sectionId: sectionId,
      exam: {
        batchId: session.currentBatch,
      },
    },
    select: {
      exam: {
        select: {
          name: true,
          batchId: true,
          id: true,
        },
      },
      examSubject: {
        select: {
          subject: true,
          subjectId: true,
          examSubjectPartition: {
            select: {
              minMark: true,
              totalMarks: true,
              convertTo: true,
              assessmentFormat: {
                select: {
                  name: true,
                  id: true,
                },
              },
              Mark: {
                where: {
                  studentId: studentId,
                },
              },
            },
          },
        },
      },
    },
  });

  const subjectList = await getSubjectToStudentByGroupAndClassId(
    groupId,
    classId
  );

  function getSubjectMarksBySubjectId(subjectId: string, subjects: any) {
    const data = subjects.find((subject) => subject.subjectId === subjectId);
    return data;
  }
  const transformedData = examData.map((group) => ({
    ...group,
    subjects: subjectList.map((subject) => {
      return getSubjectMarksBySubjectId(subject.subjectId, group.examSubject);
    }),
  }));

  return { markList: transformedData, subjectList };

  // const examMarks = await db.exam.findMany({
  //   where: {
  //     batchId: session.currentBatch,
  //     isDeleted: false,
  //     examGroup: {
  //       some: {
  //         examSubject: {
  //           some: {
  //             Mark: {
  //               some: {
  //                 studentId: studentId,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   select: {
  //     id: true,
  //     name: true,
  //     examGroup: {
  //       select: {
  //         examSubject: {
  //           select: {
  //             id: true,
  //             totalMarks: true,
  //             subject: {
  //               select: {
  //                 id: true,
  //                 name: true,
  //                 description: true,
  //                 isActive: true,
  //                 elective: true,
  //                 createdAt: true,
  //                 updatedAt: true,
  //                 isDeleted: true,
  //                 regulationId: true,
  //                 sectionId: true,
  //                 branchId: true,
  //                 subjectMasterId: true,
  //                 classId: true,
  //                 subjectOrder: true,
  //               },
  //             },
  //             Mark: {
  //               where: {
  //                 studentId: studentId,
  //               },
  //               select: {
  //                 id: true,
  //                 mark: true,
  //                 attandance: true,
  //                 studentId: true,
  //                 examSubjectId: true,
  //                 examSubjectPartitionId: true,
  //                 subjectId: true,
  //                 assessmentFormatId: true,
  //                 SubjectMasterId: true,
  //                 userId: true,
  //                 updatedAt: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  // Transform data to match desired format
  // const formattedExams = await Promise.all(
  //   examMarks.map(async (exam) => {
  //     const subjects = exam.examGroup.flatMap((group) =>
  //       group.examSubject.map((subject) => {
  //         const mark = subject.Mark[0];
  //         const totalMark = Number(subject.totalMarks);
  //         const obtainedMark = Number(mark?.mark || 0);

  //         return {
  //           id: subject.subject.id,
  //           description: subject.subject.description,
  //           name: subject.subject.name,
  //           isActive: subject.subject.isActive,
  //           elective: subject.subject.elective,
  //           createdAt: subject.subject.createdAt,
  //           updatedAt: subject.subject.updatedAt,
  //           isDeleted: subject.subject.isDeleted,
  //           regulationId: subject.subject.regulationId,
  //           sectionId: subject.subject.sectionId,
  //           branchId: subject.subject.branchId,
  //           subjectMasterId: subject.subject.subjectMasterId,
  //           classId: subject.subject.classId,
  //           subjectOrder: subject.subject.subjectOrder,
  //           marks: [
  //             {
  //               id: mark?.id,
  //               mark: mark?.mark,
  //               attandance: mark?.attandance,
  //               studentId: mark?.studentId,
  //               examSubjectId: mark?.examSubjectId,
  //               examSubjectPartitionId: mark?.examSubjectPartitionId,
  //               subjectId: mark?.subjectId,
  //               assessmentFormatId: mark?.assessmentFormatId,
  //               SubjectMasterId: mark?.SubjectMasterId,
  //               userId: mark?.userId,
  //               updatedAt: mark?.updatedAt,
  //               total: totalMark,
  //               entryStatus: mark ? true : false,
  //               centum: obtainedMark === totalMark,
  //             },
  //           ],
  //           subjectTotalMark: totalMark,
  //           absentStatus: mark?.attandance === 1,
  //           absentOn: mark?.attandance === 1 ? [subject.subject.name] : [],
  //           failingStatus: obtainedMark < totalMark * 0.35, // Assuming 35% is passing mark
  //           failingOn:
  //             obtainedMark < totalMark * 0.35 ? [subject.subject.name] : [],
  //           centum: obtainedMark === totalMark,
  //           subjectPassed: obtainedMark >= totalMark * 0.35 ? 1 : 0,
  //           subjectFailed: obtainedMark < totalMark * 0.35 ? 1 : 0,
  //         };
  //       })
  //     );

  //     const totalMark = subjects.reduce(
  //       (sum, subject) => sum + Number(subject.marks[0]?.mark || 0),
  //       0
  //     );
  //     const totalPossibleMark = subjects.reduce(
  //       (sum, subject) => sum + subject.subjectTotalMark,
  //       0
  //     );
  //     const totalPercentage = (totalMark / totalPossibleMark) * 100;

  //     // Calculate rank (you'll need to implement the actual rank calculation logic)
  //     const rank = await calculateRank(exam.id, studentId, totalMark);

  //     return {
  //       examName: exam.name,
  //       id: exam.id,
  //       subjects,
  //       centumCount: subjects.filter((s) => s.centum).length,
  //       totalMark,
  //       totalAverage: Math.round(totalPercentage),
  //       subjectPassed: subjects.reduce((sum, s) => sum + s.subjectPassed, 0),
  //       subjectFailed: subjects.reduce((sum, s) => sum + s.subjectFailed, 0),
  //       failingStatus: subjects.some((s) => s.failingStatus),
  //       totalPercentage: Math.round(totalPercentage),
  //       attendance: !subjects.some((s) => s.absentStatus),
  //       rank,
  //     };
  //   })
  // );

  // return { formattedExams };
}

// async function calculateRank(
//   examId: string,
//   studentId: string,
//   studentTotalMark: number
// ) {
//   const allStudentMarks = await db.mark.findMany({
//     where: {
//       examSubject: {
//         examGroup: {
//           examId: examId,
//         },
//       },
//     },
//     select: {
//       studentId: true,
//       mark: true,
//     },
//   });

//   const marks = allStudentMarks.reduce((acc, { studentId, mark }) => {
//     if (!acc[studentId]) {
//       acc[studentId] = 0;
//     }
//     acc[studentId] += mark;
//     return acc;
//   }, {});

//   const sortedMarks = Object.entries(marks).map(([studentId, totalMark]) => ({
//     studentId,
//     totalMark,
//   }));

//   const rank = sortedMarks.findIndex((m) => m.studentId === studentId) + 1;

//   return rank;
// }
