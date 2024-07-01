import { useGetExamSubjectsByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectsByClassSectionIdQuery';
import { useEffect, useState } from 'react';
import { Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

interface Analytics {
  numberOfPassStudents: { male: number; female: number; overall: number };
  numberOfFailStudents: { male: number; female: number; overall: number };
  highestMark: { male: number; female: number; overall: number };
  highestMarkStudentName: { male: string; female: string; overall: string };
  lowestMark: { male: number; female: number; overall: number };
  lowestMarkStudentName: { male: string; female: string; overall: string };
  averageMark: { male: number; female: number; overall: number };
  passPercentage: { male: number; female: number; overall: number };
  failPercentage: { male: number; female: number; overall: number };
  attendance: { male: number; female: number; overall: number };
}
export default function StudentMarkList({
  students,
  classId,
  examId,
  sectionId,
}: {
  students: any[];
  classId: string;
  sectionId?: string;
  examId: string;
}) {
  const [analytics, setAnalytics] = useState<Map<string, Analytics>>(new Map());

  const getMarkForSubject = (student, subjectId) => {
    const subject = student.subjects.find(
      (subject) => subject.id === subjectId
    );

    if (subject && subject.marks.length > 0) {
      return subject.marks;
    }
    return [];
  };
  const getStudentSubject = (student, subjectId) => {
    const subject = student.subjects.find(
      (subject) => subject.id === subjectId
    );
    return subject;
  };

  const { data: subjectList } = useGetExamSubjectsByClassSectionIdQuery(
    {
      examId,
      classId,
      sectionId,
    },
    {
      enabled: !!examId && !!classId && !!sectionId,
    }
  );
  // function analyzeSubjectPerformance(subjectId: string): Analytics {
  //   const result: Analytics = {
  //     numberOfPassStudents: { male: 0, female: 0, overall: 0 },
  //     numberOfFailStudents: { male: 0, female: 0, overall: 0 },
  //     highestMark: { male: 0, female: 0, overall: 0 },
  //     highestMarkStudentName: { male: '', female: '', overall: '' },
  //     lowestMark: { male: Infinity, female: Infinity, overall: Infinity },
  //     lowestMarkStudentName: { male: '', female: '', overall: '' },
  //     averageMark: { male: 0, female: 0, overall: 0 },
  //     passPercentage: { male: 0, female: 0, overall: 0 },
  //     failPercentage: { male: 0, female: 0, overall: 0 },
  //   };

  //   let totalMarks = 0;
  //   let totalStudents = 0;

  //   students.forEach((student) => {
  //     const subject = student.subjects.find((subj) => subj.id === subjectId);
  //     const gender =
  //       student.gender.toLowerCase() === 'male' ? 'male' : 'female';

  //     if (subject) {
  //       const mark = subject.subjectTotalMark || 0;
  //       totalMarks += subject.subjectTotalMark || 0;
  //       totalStudents += 1;

  //       const studentFullName =
  //         `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim();

  //       if (mark > result.highestMark) {
  //         result.highestMark = mark;
  //         result.highestMarkStudentName[gender] = studentFullName;
  //       }

  //       if (mark < result.lowestMark) {
  //         result.lowestMark = mark;
  //         result.lowestMarkStudentName = studentFullName;
  //       }

  //       if (subject.failingStatus) {
  //         result.numberOfFailStudents += 1;
  //       } else {
  //         result.numberOfPassStudents += 1;
  //       }
  //     }
  //   });

  //   if (totalStudents > 0) {
  //     result.averageMark = totalMarks / totalStudents;
  //     result.lowestMark =
  //       result.lowestMark === Infinity ? 0 : result.lowestMark;
  //   } else {
  //     result.lowestMark = 0;
  //   }
  //   result.passPercentage = (result.numberOfPassStudents / totalStudents) * 100;
  //   result.failPercentage = (result.numberOfFailStudents / totalStudents) * 100;

  //   return result;
  // }

  function analyzeSubjectPerformance(subjectId: string): Analytics {
    const result: Analytics = {
      numberOfPassStudents: { male: 0, female: 0, overall: 0 },
      numberOfFailStudents: { male: 0, female: 0, overall: 0 },
      highestMark: { male: 0, female: 0, overall: 0 },
      highestMarkStudentName: { male: '', female: '', overall: '' },
      lowestMark: { male: Infinity, female: Infinity, overall: Infinity },
      lowestMarkStudentName: { male: '', female: '', overall: '' },
      averageMark: { male: 0, female: 0, overall: 0 },
      passPercentage: { male: 0, female: 0, overall: 0 },
      failPercentage: { male: 0, female: 0, overall: 0 },
      attendance: { male: 0, female: 0, overall: 0 },
    };

    let totalMarks = { male: 0, female: 0, overall: 0 };
    let totalStudents = { male: 0, female: 0, overall: 0 };

    students.forEach((student) => {
      const subject = student.subjects.find((subj) => subj.id === subjectId);
      const gender =
        student.gender.toLowerCase() === 'male' ? 'male' : 'female';

      if (subject) {
        const mark = subject.subjectTotalMark || 0;
        totalMarks[gender] += mark;
        totalMarks.overall += mark;
        totalStudents[gender] += 1;
        totalStudents.overall += 1;
        if (subject.absentStatus) {
          result.attendance[gender] += 1;
          result.attendance.overall += 1;
        }
        const studentFullName =
          `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim();

        if (mark > result.highestMark[gender]) {
          result.highestMark[gender] = mark;
          result.highestMarkStudentName[gender] = studentFullName;
        }
        if (mark > result.highestMark.overall) {
          result.highestMark.overall = mark;
          result.highestMarkStudentName.overall = studentFullName;
        }

        if (mark < result.lowestMark[gender]) {
          result.lowestMark[gender] = mark;
          result.lowestMarkStudentName[gender] = studentFullName;
        }
        if (mark < result.lowestMark.overall) {
          result.lowestMark.overall = mark;
          result.lowestMarkStudentName.overall = studentFullName;
        }

        if (subject.failingStatus) {
          result.numberOfFailStudents[gender] += 1;
          result.numberOfFailStudents.overall += 1;
        } else {
          result.numberOfPassStudents[gender] += 1;
          result.numberOfPassStudents.overall += 1;
        }
      }
    });

    if (totalStudents.male > 0) {
      result.averageMark.male = totalMarks.male / totalStudents.male;
      result.lowestMark.male =
        result.lowestMark.male === Infinity ? 0 : result.lowestMark.male;
      result.passPercentage.male =
        (result.numberOfPassStudents.male / totalStudents.male) * 100;
      result.failPercentage.male =
        (result.numberOfFailStudents.male / totalStudents.male) * 100;
    }

    if (totalStudents.female > 0) {
      result.averageMark.female = totalMarks.female / totalStudents.female;
      result.lowestMark.female =
        result.lowestMark.female === Infinity ? 0 : result.lowestMark.female;
      result.passPercentage.female =
        (result.numberOfPassStudents.female / totalStudents.female) * 100;
      result.failPercentage.female =
        (result.numberOfFailStudents.female / totalStudents.female) * 100;
    }

    if (totalStudents.overall > 0) {
      result.averageMark.overall = totalMarks.overall / totalStudents.overall;
      result.lowestMark.overall =
        result.lowestMark.overall === Infinity ? 0 : result.lowestMark.overall;
      result.passPercentage.overall =
        (result.numberOfPassStudents.overall / totalStudents.overall) * 100;
      result.failPercentage.overall =
        (result.numberOfFailStudents.overall / totalStudents.overall) * 100;
    }

    return result;
  }
  useEffect(() => {
    if (subjectList?.length > 0) {
      const newAnalytics = new Map<string, Analytics>();

      subjectList.forEach((subject) => {
        const analyticsForSubject = analyzeSubjectPerformance(
          subject.subject.id
        );
        newAnalytics.set(subject.id, analyticsForSubject);
      });

      setAnalytics(newAnalytics);
    }
  }, [students, subjectList]);

  const getTotalAvgMark = () => {
    let totalMarks = 0;
    let totalStudents = 0;

    students.forEach((student) => {
      totalMarks += student.totalMark;
      totalStudents += 1;
    });

    if (totalStudents > 0) {
      return totalMarks / totalStudents;
    } else {
      return 0;
    }
  };
  const getTotalPassCount = () => {
    let totalPassCount = 0;
    let totalStudents = 0;
    students.forEach((student) => {
      if (student.failingStatus) {
        totalPassCount += 1;
      }
      totalStudents += 1;
    });
    return totalStudents - totalPassCount;
  };
  const getTotalFailCount = () => {
    let totalPassCount = 0;
    students.forEach((student) => {
      if (student.failingStatus) {
        totalPassCount += 1;
      }
    });
    return totalPassCount;
  };
  const getTotalPassPercentage = () => {
    let totalPassCount = 0;
    let totalStudents = 0;
    students.forEach((student) => {
      if (!student.failingStatus) {
        totalPassCount += 1;
      }
      totalStudents += 1;
    });
    return (totalPassCount / totalStudents) * 100;
  };
  const getTotalFailPercentage = () => {
    let totalPassCount = 0;
    let totalStudents = 0;
    students.forEach((student) => {
      if (student.failingStatus) {
        totalPassCount += 1;
      }
      totalStudents += 1;
    });
    return (totalPassCount / totalStudents) * 100;
  };
  const getTotalHighestMark = () => {
    let totalMarks = 0;

    students.forEach((student) => {
      totalMarks =
        totalMarks > student.totalMark ? totalMarks : student.totalMark;
    });

    return totalMarks;
  };
  const getTotalLowestMark = () => {
    let totalMarks = Infinity;

    students.forEach((student) => {
      if (!student.attandance) {
        totalMarks =
          totalMarks < student.totalMark ? totalMarks : student.totalMark;
      }
    });

    return totalMarks;
  };

  return (
    <section>
      {subjectList && (
        <div className="mt-4 space-y-4 rounded-md bg-white p-6">
          <Table className="border-1 border">
            <TableHeader>
              <TableRow className="mt-5 bg-primary-300 text-center">
                <TableCell></TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Appeared</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold"># of Pass</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold"># of Fail</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Pass %</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Fail %</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Highest</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Lowest</Text>
                </TableCell>
              </TableRow>
              {subjectList.map((subject) => (
                <TableRow className="mt-5 " key={subject.id}>
                  <TableCell className="bg-primary-300">
                    <Text className="size-lg font-semibold">
                      {subject.subject.name}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text className="size-lg text-center font-semibold">
                      <div className="flex flex-col justify-evenly">
                        <Text className="size-lg text-center font-semibold">
                          {analytics.get(subject.id)?.attendance.overall}
                        </Text>
                        <div className="flex justify-evenly">
                          <Text className="text-primary-800">
                            M:
                            {analytics.get(subject.id)?.attendance.male}
                          </Text>
                          <Text className="text-primary-800">
                            F:
                            {analytics.get(subject.id)?.attendance.female}
                          </Text>
                        </div>
                      </div>
                    </Text>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col justify-evenly">
                      <Text className="size-lg text-center font-semibold">
                        {
                          analytics.get(subject.id)?.numberOfPassStudents
                            .overall
                        }
                      </Text>
                      <div className="flex justify-evenly">
                        <Text className="text-primary-800">
                          M:
                          {analytics.get(subject.id)?.numberOfPassStudents.male}
                        </Text>
                        <Text className="text-primary-800">
                          F:
                          {
                            analytics.get(subject.id)?.numberOfPassStudents
                              .female
                          }
                        </Text>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Text className="size-lg text-center font-semibold">
                      {analytics.get(subject.id)?.numberOfFailStudents.overall}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text className="size-lg text-center font-semibold">
                      {analytics
                        .get(subject.id)
                        ?.passPercentage.overall.toFixed(2)}
                      %
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text className="size-lg text-center font-semibold">
                      {analytics
                        .get(subject.id)
                        ?.failPercentage.overall.toFixed(2)}
                      %
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text className="size-lg text-center font-semibold">
                      {analytics.get(subject.id)?.highestMark.overall}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text className="size-lg text-center font-semibold">
                      {analytics.get(subject.id)?.lowestMark.overall}
                    </Text>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="mt-5 bg-green-100 text-center">
                <TableCell>
                  <Text className="text-center text-lg font-semibold">
                    Overall
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    Average {getTotalAvgMark().toFixed(2)}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {getTotalPassCount()}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {getTotalFailCount()}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {getTotalPassPercentage().toFixed(2)}%
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {getTotalFailPercentage().toFixed(2)}%
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {getTotalHighestMark()}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {getTotalLowestMark()}
                  </Text>
                </TableCell>
              </TableRow>
              <TableRow className="mt-5 bg-primary-300 text-center"></TableRow>

              <br />
              <TableRow className="bg-primary-300">
                <TableCell>
                  <Text className="text-center text-lg font-semibold"># </Text>
                </TableCell>
                <TableCell>
                  <Text className="text-lg font-semibold">Student Name </Text>
                </TableCell>
                {subjectList.map((subject) => (
                  <TableCell key={subject.subject.id}>
                    <div className="w-full ">
                      <div className="text-center">
                        <Text className="size-lg font-semibold">
                          {subject.subject.name}
                        </Text>
                      </div>
                      <div className="flex justify-evenly">
                        {subject.examSubjectPartition.map((partition) => (
                          <span
                            className="size-lg font-semibold"
                            key={partition.id}
                          >
                            {partition.assessmentFormat.name}
                          </span>
                        ))}
                        <span>Tot</span>
                      </div>
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <Text className="text-lg font-semibold">Total </Text>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>
                    {student.firstName} {student.lastName}
                  </TableCell>
                  {subjectList.map((subject) => (
                    <TableCell key={subject.subjectId}>
                      <div className="w-full">
                        <div className="flex justify-evenly">
                          {getMarkForSubject(student, subject.subject.id).map(
                            (mark) =>
                              mark.attandance ? (
                                <span
                                  key={mark.id}
                                  className="text-bold text-red-500"
                                >
                                  A
                                </span>
                              ) : (
                                <span key={mark.id}>{mark.total}</span>
                              )
                          )}

                          <b>
                            {getStudentSubject(student, subject.subject.id)
                              ?.failingStatus ? (
                              <span className="text-red-500">
                                {getStudentSubject(student, subject.subject.id)
                                  .subjectTotalMark || 0}
                                (F)
                              </span>
                            ) : (
                              <span className="text-green-500">
                                {getStudentSubject(student, subject.subject.id)
                                  ?.subjectTotalMark || 0}
                                (P)
                              </span>
                            )}
                          </b>
                        </div>
                      </div>
                    </TableCell>
                  ))}
                  <TableCell>
                    {student.failingStatus ? (
                      <>
                        <p className="text-red-500">
                          {student.totalMark}(
                          {student.totalPercentage.toFixed(2)}%)
                        </p>
                        <p className="text-red-500">
                          {' '}
                          Avg:{student.totalAverage}(F)
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-green-500">
                          {student.totalMark}(
                          {student.totalPercentage.toFixed(2)}%)
                        </p>
                        <p className="text-green-500">
                          Avg:{student.totalAverage}-(P)
                        </p>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
