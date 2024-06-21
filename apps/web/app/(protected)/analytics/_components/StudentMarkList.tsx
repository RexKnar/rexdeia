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
  numberOfPassStudents: number;
  numberOfFailStudents: number;
  highestMark: number;
  highestMarkStudentName: string;
  lowestMark: number;
  lowestMarkStudentName: string;
  averageMark: number;
  passPercentage: number;
  failPercentage: number;
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
  function analyzeSubjectPerformance(subjectId: string): Analytics {
    const result: Analytics = {
      numberOfPassStudents: 0,
      numberOfFailStudents: 0,
      highestMark: 0,
      highestMarkStudentName: '',
      lowestMark: Infinity,
      lowestMarkStudentName: '',
      averageMark: 0,
      passPercentage: 0,
      failPercentage: 0,
    };

    let totalMarks = 0;
    let totalStudents = 0;

    students.forEach((student) => {
      const subject = student.subjects.find((subj) => subj.id === subjectId);

      if (subject) {
        const mark = subject.subjectTotalMark || 0;
        totalMarks += subject.subjectTotalMark || 0;
        totalStudents += 1;

        const studentFullName =
          `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim();

        if (mark > result.highestMark) {
          result.highestMark = mark;
          result.highestMarkStudentName = studentFullName;
        }

        if (mark < result.lowestMark) {
          result.lowestMark = mark;
          result.lowestMarkStudentName = studentFullName;
        }

        if (subject.failingStatus) {
          result.numberOfFailStudents += 1;
        } else {
          result.numberOfPassStudents += 1;
        }
      }
    });

    if (totalStudents > 0) {
      result.averageMark = totalMarks / totalStudents;
      result.lowestMark =
        result.lowestMark === Infinity ? 0 : result.lowestMark;
    } else {
      result.lowestMark = 0;
    }
    result.passPercentage = (result.numberOfPassStudents / totalStudents) * 100;
    result.failPercentage = (result.numberOfFailStudents / totalStudents) * 100;

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
              <TableRow>
                <TableCell>Student Name </TableCell>
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
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
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
                      <span className="text-red-500">
                        {student.totalMark}(F)
                      </span>
                    ) : (
                      <span className="text-green-500">
                        {student.totalMark}(P)
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <Text className="text-sm">Average</Text>
                </TableCell>
                {subjectList.map((subject) => (
                  <TableCell key={subject.id}>
                    <div className="text-center">
                      {analytics.get(subject.id)?.averageMark.toFixed(2)}
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <Text className="text-sm">
                    {getTotalAvgMark().toFixed(2)}
                  </Text>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text className="text-sm">Number Of Pass</Text>
                </TableCell>
                {subjectList.map((subject) => (
                  <TableCell key={subject.id}>
                    <div className="text-center">
                      {analytics.get(subject.id)?.numberOfPassStudents}
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <Text className="text-sm">{getTotalPassCount()}</Text>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text className="text-sm">Number Of Fail</Text>
                </TableCell>
                {subjectList.map((subject) => (
                  <TableCell key={subject.id}>
                    <div className="text-center">
                      {analytics.get(subject.id)?.numberOfFailStudents}
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <Text className="text-sm">{getTotalFailCount()}</Text>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text className="text-sm">Pass Percentage</Text>
                </TableCell>
                {subjectList.map((subject) => (
                  <TableCell key={subject.id}>
                    <div className="text-center">
                      {analytics.get(subject.id)?.passPercentage.toFixed(2)}%
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <Text className="text-sm">
                    {getTotalPassPercentage().toFixed(2)}%
                  </Text>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text className="text-sm">Fail Percentage</Text>
                </TableCell>
                {subjectList.map((subject) => (
                  <TableCell key={subject.id}>
                    <div className="text-center">
                      {analytics.get(subject.id)?.failPercentage.toFixed(2)}%
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <Text className="text-sm">
                    {getTotalFailPercentage().toFixed(2)}%
                  </Text>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text className="text-sm">Highest Mark</Text>
                </TableCell>
                {subjectList.map((subject) => (
                  <TableCell key={subject.id}>
                    <div className="text-center">
                      {analytics.get(subject.id)?.highestMark}
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <Text className="text-sm">{getTotalHighestMark()}</Text>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text className="text-sm">Lowest Mark</Text>
                </TableCell>
                {subjectList.map((subject) => (
                  <TableCell key={subject.id}>
                    <div className="text-center">
                      {analytics.get(subject.id)?.lowestMark}
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <Text className="text-sm">{getTotalLowestMark()}</Text>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
