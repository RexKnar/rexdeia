import { useGetExamSubjectsByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectsByClassSectionIdQuery';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  markEntry: { male: number; female: number; overall: number };
}

const calculatePercentage = (part: number, whole: number) =>
  whole > 0 ? (part / whole) * 100 : 0;

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

  const { data: subjectList } = useGetExamSubjectsByClassSectionIdQuery(
    { examId, classId, sectionId },
    { enabled: !!examId && !!classId && !!sectionId }
  );

  const getMarkForSubject = useCallback((student, subjectId) => {
    const subject = student.subjects.find(
      (subject) => subject.id === subjectId
    );
    return subject && subject.marks.length > 0 ? subject.marks : [];
  }, []);

  const getStudentSubject = useCallback((student, subjectId) => {
    return student.subjects.find((subject) => subject.id === subjectId);
  }, []);

  const analyzeSubjectPerformance = useCallback(
    (subjectId: string): Analytics => {
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
        markEntry: { male: 0, female: 0, overall: 0 },
      };

      let totalMarks = { male: 0, female: 0, overall: 0 };
      let totalStudents = { male: 0, female: 0, overall: 0 };

      students.forEach((student) => {
        const subject = student.subjects.find((subj) => subj.id === subjectId);
        if (!subject) return;

        const gender =
          student.gender.toLowerCase() === 'male' ? 'male' : 'female';
        const mark = subject.subjectTotalMark || 0;
        const studentFullName =
          `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim();

        totalMarks[gender] += mark;
        totalMarks.overall += mark;
        totalStudents[gender]++;
        totalStudents.overall++;

        if (!subject.absentStatus && subject?.marks?.length > 0) {
          result.attendance[gender]++;
          result.attendance.overall++;
        }
        if (subject?.marks?.length === 0) {
          result.markEntry[gender]++;
          result.markEntry.overall++;
        }

        ['male', 'female', 'overall'].forEach((category) => {
          if (mark > result.highestMark[category]) {
            result.highestMark[category] = mark;
            result.highestMarkStudentName[category] = studentFullName;
          }
          if (mark < result.lowestMark[category]) {
            result.lowestMark[category] = mark;
            result.lowestMarkStudentName[category] = studentFullName;
          }
        });

        if (subject.failingStatus) {
          result.numberOfFailStudents[gender]++;
          result.numberOfFailStudents.overall++;
        } else {
          result.numberOfPassStudents[gender]++;
          result.numberOfPassStudents.overall++;
        }
      });

      ['male', 'female', 'overall'].forEach((category) => {
        if (totalStudents[category] > 0) {
          result.averageMark[category] =
            totalMarks[category] / totalStudents[category];
          result.lowestMark[category] =
            result.lowestMark[category] === Infinity
              ? 0
              : result.lowestMark[category];
          result.passPercentage[category] = calculatePercentage(
            result.numberOfPassStudents[category],
            totalStudents[category]
          );
          result.failPercentage[category] = calculatePercentage(
            result.numberOfFailStudents[category],
            totalStudents[category]
          );
        }
      });

      return result;
    },
    [students]
  );

  useEffect(() => {
    if (subjectList?.length > 0) {
      const newAnalytics = new Map<string, Analytics>();
      subjectList.forEach((subject) => {
        newAnalytics.set(
          subject.id,
          analyzeSubjectPerformance(subject.subject.id)
        );
      });
      setAnalytics(newAnalytics);
    }
  }, [students, subjectList, analyzeSubjectPerformance]);

  const overallStats = useMemo(() => {
    let totalMarks = 0,
      totalStudents = 0,
      totalPass = 0,
      totalFail = 0,
      highestMark = 0,
      lowestMark = Infinity;

    students.forEach((student) => {
      totalMarks += student.totalMark;
      totalStudents++;
      if (student.failingStatus) {
        totalFail++;
      } else {
        totalPass++;
      }
      highestMark = Math.max(highestMark, student.totalMark);
      if (!student.attandance) {
        lowestMark = Math.min(lowestMark, student.totalMark);
      }
    });

    return {
      avgMark: totalStudents > 0 ? totalMarks / totalStudents : 0,
      passCount: totalPass,
      failCount: totalFail,
      passPercentage: calculatePercentage(totalPass, totalStudents),
      failPercentage: calculatePercentage(totalFail, totalStudents),
      highestMark,
      lowestMark: lowestMark === Infinity ? 0 : lowestMark,
    };
  }, [students]);

  const renderSubjectRow = (subject) => {
    const subjectAnalytics = analytics.get(subject.id);
    return (
      <TableRow className="mt-5 print:hidden" key={subject.id}>
        <TableCell className="bg-primary-300">
          <Text className="size-lg font-semibold">{subject.subject.name}</Text>
        </TableCell>
        <TableCell>
          <Text className="size-lg text-center font-semibold">
            <div className="flex flex-col justify-evenly">
              <Text className="size-lg text-center font-semibold">
                {subjectAnalytics?.markEntry.overall}
              </Text>
              <div className="flex justify-evenly">
                <Text className="text-primary-800">
                  M: {subjectAnalytics?.markEntry.male}
                </Text>
                <Text className="text-primary-800">
                  F: {subjectAnalytics?.markEntry.female}
                </Text>
              </div>
            </div>
          </Text>
        </TableCell>
        <TableCell>
          <Text className="size-lg text-center font-semibold">
            <div className="flex flex-col justify-evenly">
              <Text className="size-lg text-center font-semibold">
                {subjectAnalytics?.attendance.overall}
              </Text>
              <div className="flex justify-evenly">
                <Text className="text-primary-800">
                  M: {subjectAnalytics?.attendance.male}
                </Text>
                <Text className="text-primary-800">
                  F: {subjectAnalytics?.attendance.female}
                </Text>
              </div>
            </div>
          </Text>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Text className="size-lg text-center font-semibold">
              {subjectAnalytics?.numberOfPassStudents.overall}
            </Text>
            <div className="flex justify-evenly">
              <Text className="text-primary-800">
                M: {subjectAnalytics?.numberOfPassStudents.male}
              </Text>
              <Text className="text-primary-800">
                F: {subjectAnalytics?.numberOfPassStudents.female}
              </Text>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Text className="size-lg text-center font-semibold">
            {subjectAnalytics?.numberOfFailStudents.overall}
          </Text>
        </TableCell>
        <TableCell>
          <Text className="size-lg text-center font-semibold">
            {subjectAnalytics?.passPercentage.overall?.toFixed(2)}%
          </Text>
        </TableCell>
        <TableCell>
          <Text className="size-lg text-center font-semibold">
            {subjectAnalytics?.failPercentage.overall?.toFixed(2)}%
          </Text>
        </TableCell>
        <TableCell>
          <Text className="size-lg text-center font-semibold">
            {subjectAnalytics?.highestMark.overall}
          </Text>
        </TableCell>
        <TableCell>
          <Text className="size-lg text-center font-semibold">
            {subjectAnalytics?.lowestMark.overall}
          </Text>
        </TableCell>
      </TableRow>
    );
  };

  const renderStudentRow = (student, index) => (
    <TableRow key={student.id}>
      <TableCell className="text-center print:p-0">{index + 1}</TableCell>
      <TableCell className="sticky print:p-0">
        {student.firstName} {student.lastName}
      </TableCell>
      {subjectList.map((subject) => (
        <TableCell key={subject.subjectId} className="w:1/3 print:p-0">
          <div className="w-full">
            <div className="flex justify-evenly ">
              {getMarkForSubject(student, subject.subject.id).map((mark) =>
                mark.attandance ? (
                  <span
                    key={mark.id}
                    className="text-bold text-red-500 print:hidden"
                  >
                    A
                  </span>
                ) : (
                  <span className="print:hidden" key={mark.id}>
                    {mark.total}
                  </span>
                )
              )}
              <b>
                {getStudentSubject(student, subject.subject.id)
                  ?.failingStatus ? (
                  <span className="text-red-500 print:p-0 print:text-sm">
                    {getStudentSubject(student, subject.subject.id)
                      .subjectTotalMark || 0}
                    (F)
                  </span>
                ) : (
                  <span className="text-green-500 print:p-0 print:text-sm">
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
            <p className="text-red-500 print:p-0 print:text-sm">
              {student.totalMark}({student.totalPercentage?.toFixed(2)}%)
            </p>
            <p className="text-red-500 print:hidden">
              Avg:{student.totalAverage?.toFixed(2)}(F)
            </p>
          </>
        ) : (
          <>
            <p className="text-green-500 print:p-0 print:text-sm">
              {student.totalMark}({student.totalPercentage?.toFixed(2)}%)
            </p>
            <p className="text-green-500 print:p-0 print:text-sm">
              Avg:{student.totalAverage?.toFixed(2)}-(P)
            </p>
          </>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <section>
      {subjectList && (
        <div className="mt-4 space-y-4 overflow-x-auto rounded-md bg-white p-6 print:m-0 print:p-0 ">
          <Table className="border-1 border">
            <TableHeader>
              <TableRow className="mt-5 bg-primary-300 text-center print:hidden">
                <TableCell></TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Pending Entry</Text>
                </TableCell>
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
              {subjectList.map(renderSubjectRow)}
              <TableRow className="mt-5 bg-green-100 text-center print:hidden">
                <TableCell>
                  <Text className="text-center text-lg font-semibold">
                    Overall
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    Average {overallStats.avgMark?.toFixed(2)}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {overallStats.passCount}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {overallStats.failCount}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {overallStats.passPercentage?.toFixed(2)}%
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {overallStats.failPercentage?.toFixed(2)}%
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {overallStats.highestMark}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {overallStats.lowestMark}
                  </Text>
                </TableCell>
              </TableRow>
              <TableRow className="bg-primary-300">
                <TableCell>
                  <Text className="text-center text-lg font-semibold print:text-sm">
                    #{' '}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="text-lg font-semibold print:text-sm">
                    Student Name{' '}
                  </Text>
                </TableCell>
                {subjectList.map((subject) => (
                  <TableCell key={subject.subject.id}>
                    <div className="w-full ">
                      <div className="text-center">
                        <Text className="size-lg font-semibold print:text-sm">
                          {subject.subject.name}
                        </Text>
                      </div>
                      <div className="flex justify-evenly print:hidden">
                        {subject.examSubjectPartition.map((partition) => (
                          <span
                            className="size-lg font-semibold print:text-sm"
                            key={partition.id}
                          >
                            {partition.assessmentFormat.name}
                          </span>
                        ))}
                        <span className="print:hidden">Tot</span>
                      </div>
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <Text className="text-xs font-semibold">Total </Text>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>{students.map(renderStudentRow)}</TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
