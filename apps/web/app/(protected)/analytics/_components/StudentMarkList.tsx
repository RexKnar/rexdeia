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
  function analyzeSubjectPerformance(
    studentList: any,
    subjectId: string
  ): Analytics {
    const result: Analytics = {
      numberOfPassStudents: 0,
      numberOfFailStudents: 0,
      highestMark: 0,
      highestMarkStudentName: '',
      lowestMark: Infinity,
      lowestMarkStudentName: '',
      averageMark: 0,
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
    return result;
  }
  useEffect(() => {
    if (subjectList?.length > 0) {
      const newAnalytics = new Map<string, Analytics>();

      subjectList.forEach((subject) => {
        const analyticsForSubject = analyzeSubjectPerformance(
          students,
          subject.subject.id
        );
        newAnalytics.set(subject.id, analyticsForSubject);
      });

      setAnalytics(newAnalytics);
    }
  }, [students, subjectList]);

  return (
    <section>
      {subjectList && (
        <>
          <div className="flex flex-wrap gap-3">
            {subjectList.map((subject) => {
              return (
                <div
                  className="w-1/5 rounded-md border border-blue-100 bg-white p-3"
                  key={subject.id}
                >
                  <div className="flex">
                    <div className="ml-4 ">
                      <span className="text-lg font-bold text-gray-900">
                        {subject.subject.name}
                      </span>
                      {analytics.has(subject.id) && (
                        <div className="flex flex-wrap items-center justify-between">
                          <div className="w-1/2">
                            <Text className="text-sm">
                              # of Pass -
                              <span className="font-bold text-green-500">
                                {
                                  analytics.get(subject.id)
                                    ?.numberOfPassStudents
                                }
                              </span>
                            </Text>
                            <Text className="text-sm">
                              # of Fail -{' '}
                              <span className="font-bold text-red-500">
                                {
                                  analytics.get(subject.id)
                                    ?.numberOfFailStudents
                                }
                              </span>
                            </Text>
                          </div>
                          <div className="w-1/2">
                            <Text className="text-sm">
                              Highest -{' '}
                              <span className="font-bold text-green-500">
                                {analytics.get(subject.id)?.highestMark}
                              </span>
                            </Text>
                            <Text className="text-sm">
                              Lowest -{' '}
                              <span className="font-bold text-green-500">
                                {analytics.get(subject.id)?.lowestMark}
                              </span>
                            </Text>
                          </div>
                          <div className="w-1/2">
                            <Text className="text-sm">
                              Avg. -{' '}
                              <span className="font-bold text-green-500">
                                {parseFloat(
                                  analytics
                                    .get(subject.id)
                                    ?.averageMark.toFixed(2)
                                )}
                                %
                              </span>
                            </Text>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
                                  {getStudentSubject(
                                    student,
                                    subject.subject.id
                                  ).subjectTotalMark || 0}
                                  (F)
                                </span>
                              ) : (
                                <span className="text-green-500">
                                  {getStudentSubject(
                                    student,
                                    subject.subject.id
                                  )?.subjectTotalMark || 0}
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
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </section>
  );
}
