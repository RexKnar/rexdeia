// import { db } from 'lib/db';

// type StudentMarksFilter = {
//   classId?: string;
//   examId?: string;
// };

// export async function getStudentsByFilter(
//   page: number,
//   limit: number,
//   filter: any
// ) {
//   const { studentId, classId } = filter;

//   const whereClause = {};

//   if (studentId !== undefined) {
//     whereClause['studentId'] = studentId;
//   }
//   if (classId !== undefined) {
//     whereClause['classId'] = classId;
//   }

//   const [total, studentsList] = await Promise.all([
//     db.studentMapping.count({
//       where: whereClause,
//     }),
//     db.studentMapping.findMany({
//       take: limit,
//       skip: (page - 1) * limit,
//       where: whereClause,
//       select: {
//         student: true,
//       },
//     }),
//   ]);

//   let male: number = 0;
//   let female: number = 0;

//   let studentList = studentsList.map((item) => {
//     if (item.student.gender === 'male') {
//       male++;
//     } else if (item.student.gender === 'female') {
//       female++;
//     }
//     return item.student;
//   });

//   return {
//     total,
//     page,
//     limit,
//     male,
//     female,
//     data: studentList,
//   };
// }

// export async function getMarksByFilter(filter: any) {
//   const { academicExamId, classId, examId } = filter;

//   const whereClause: StudentMarksFilter = {};

//   if (examId !== undefined) {
//     whereClause['examId'] = examId;
//   }
//   if (academicExamId !== undefined) {
//     whereClause['academicExamId'] = academicExamId;
//   }
//   if (classId !== undefined) {
//     whereClause['classId'] = classId;
//   }
//   const [studentsMarks] = await Promise.all([
//     db.studentMapping.findMany({
//       where: {
//         classId: whereClause.classId,
//       },
//       select: {
//         student: {
//           select: {
//             id: true,
//             firstName: true,
//           },
//         },
//         group: {
//           select: {
//             subjectToGroup: {
//               select: {
//                 subject: {
//                   select: {
//                     academicExams: {
//                       where: { examId: whereClause.examId },
//                       select: {
//                         markEntry: {
//                           select: {
//                             mark: true,
//                             attandance: true,
//                             assessmentFormat: {
//                               select: {
//                                 id: true,
//                                 name: true,
//                               },
//                             },
//                             student: {
//                               select: {
//                                 id: true,
//                                 firstName: true,
//                               },
//                             },
//                           },
//                         },
//                       },
//                     },
//                     id: true,
//                     name: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     }),
//   ]);

//   function restructuredStudentsMarks(studentsMarks) {
//     return studentsMarks.map((item) => {
//       let studentId = item.student.id;
//       return {
//         studentId: item.student.id,
//         studentName: item.student.firstName,
//         subjects: item.group.subjectToGroup.map((subject) => {
//           const marks = subject.subject.academicExams.flatMap((exam) => {
//             return exam.markEntry.filter(
//               (mark) => mark.student.id === studentId
//             );
//           });
//           return {
//             subjectId: subject.subject.id,
//             subjectName: subject.subject.name,
//             marks: marks,
//           };
//         }),
//       };
//     });
//   }

//   const studentMarks = restructuredStudentsMarks(studentsMarks);

//   const analytics = findClassAnalytics(studentsMarks);
//   function findClassAnalytics(studentsMarks) {
//     let subjectAnalytics = {};
//     let classFirstMark = {
//       mark: -Infinity,
//       studentId: '',
//       studentName: '',
//     };
//     let classLastMark = { mark: Infinity, studentId: '', studentName: '' };

//     for (const student of studentsMarks) {
//       let studentTotalMarks = 0;

//       for (const subject of student.subjects) {
//         const { subjectName, marks } = subject;

//         if (!subjectAnalytics[subjectName]) {
//           subjectAnalytics[subjectName] = {
//             highestMark: { mark: -Infinity, studentId: '', studentName: '' },
//             lowestMark: { mark: Infinity, studentId: '', studentName: '' },
//             totalMarks: 0,
//             studentsCount: 0,
//           };
//         }

//         const subjectTotalMarks = marks.reduce(
//           (total, mark) => total + mark.mark,
//           0
//         );

//         const subjectEntry = subjectAnalytics[subjectName];
//         subjectEntry.highestMark =
//           Math.max(subjectEntry.highestMark.mark, subjectTotalMarks) ===
//           subjectTotalMarks
//             ? {
//                 mark: subjectTotalMarks,
//                 studentId: student.studentId,
//                 studentName: student.studentName,
//               }
//             : subjectEntry.highestMark;

//         subjectEntry.lowestMark =
//           Math.min(subjectEntry.lowestMark.mark, subjectTotalMarks) ===
//           subjectTotalMarks
//             ? {
//                 mark: subjectTotalMarks,
//                 studentId: student.studentId,
//                 studentName: student.studentName,
//               }
//             : subjectEntry.lowestMark;

//         studentTotalMarks += subjectTotalMarks;

//         subjectEntry.totalMarks += subjectTotalMarks;
//         subjectEntry.studentsCount++;
//       }

//       if (studentTotalMarks > classFirstMark.mark) {
//         classFirstMark = {
//           mark: studentTotalMarks,
//           studentId: student.studentId,
//           studentName: student.studentName,
//         };
//       }
//       if (studentTotalMarks < classLastMark.mark) {
//         classLastMark = {
//           mark: studentTotalMarks,
//           studentId: student.studentId,
//           studentName: student.studentName,
//         };
//       }
//     }

//     Object.keys(subjectAnalytics).forEach((subjectName) => {
//       const subjectData = subjectAnalytics[subjectName];
//       subjectData.averageMark =
//         subjectData.totalMarks / subjectData.studentsCount;
//     });

//     return { subjectAnalytics, classFirstMark, classLastMark };
//   }

//   return {
//     studentMarks,
//     analytics,
//   };
// }
