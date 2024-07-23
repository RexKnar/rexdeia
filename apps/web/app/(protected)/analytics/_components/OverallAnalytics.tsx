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
  absent: { male: number; female: number; overall: number };
  markEntry: { male: number; female: number; overall: number };
  totalStudents: { male: number; female: number; overall: number };
}

const calculatePercentage = (part: number, whole: number) =>
  whole > 0 ? (part / whole) * 100 : 0;

export default function OverallAnalytics({
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
    sectionId ? { examId, classId, sectionId } : { examId, classId },
    { enabled: !!examId && !!classId }
  );

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
        absent: { male: 0, female: 0, overall: 0 },
        markEntry: { male: 0, female: 0, overall: 0 },
        totalStudents: { male: 0, female: 0, overall: 0 },
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

        result.totalStudents[gender]++;
        result.totalStudents.overall++;
        totalMarks[gender] += mark;
        totalMarks.overall += mark;
        totalStudents[gender]++;
        totalStudents.overall++;

        if (!subject.absentStatus && subject?.marks?.length > 0) {
          result.attendance[gender]++;
          result.attendance.overall++;
        } else if (subject.absentStatus && subject?.marks?.length > 0) {
          result.absent[gender]++;
          result.absent.overall++;
        }
        if (subject?.marks?.length === 0) {
          result.markEntry[gender]++;
          result.markEntry.overall++;
        }

        // ['male', 'female', 'overall'].forEach((category) => {
        //   if (mark > result.highestMark[category]) {
        //     result.highestMark[category] = mark;
        //     result.highestMarkStudentName[category] = studentFullName;
        //   }
        //   if (mark < result.lowestMark[category] && !subject.absentStatus) {
        //     result.lowestMark[category] = mark;
        //     result.lowestMarkStudentName[category] = studentFullName;
        //   }
        // });

        if (mark > result.highestMark[gender]) {
          result.highestMark[gender] = mark;
          result.highestMarkStudentName[gender] = studentFullName;
        }
        if (mark < result.lowestMark[gender] && !subject.absentStatus) {
          result.lowestMark[gender] = mark;
          result.lowestMarkStudentName[gender] = studentFullName;
        }

        if (mark > result.highestMark['overall']) {
          result.highestMark['overall'] = mark;
          result.highestMarkStudentName['overall'] = studentFullName;
        }
        if (mark < result.lowestMark['overall'] && !subject.absentStatus) {
          result.lowestMark['overall'] = mark;
          result.lowestMarkStudentName['overall'] = studentFullName;
        }

        if (subject.failingStatus && !subject.absentStatus) {
          result.numberOfFailStudents[gender]++;
          result.numberOfFailStudents.overall++;
        } else if (!subject.failingStatus && !subject.absentStatus) {
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
      lowestMark = 0,
      isFirst = true;

    students.forEach((student) => {
      totalMarks += student.totalMark;
      totalStudents++;
      if (student.failingStatus) {
        totalFail++;
      } else {
        totalPass++;
      }
      highestMark = Math.max(highestMark, student.totalMark);

      if (student.attendance) {
        if (isFirst) {
          lowestMark = student.totalMark;
          isFirst = false;
        } else {
          lowestMark = Math.min(lowestMark, student.totalMark);
        }
      }
    });

    return {
      avgMark: totalStudents > 0 ? totalMarks / totalStudents : 0,
      passCount: totalPass,
      failCount: totalFail,
      passPercentage: calculatePercentage(totalPass, totalStudents),
      failPercentage: calculatePercentage(totalFail, totalStudents),
      highestMark,
      lowestMark,
    };
  }, [students]);

  const renderSubjectRow = (subject) => {
    const subjectAnalytics = analytics.get(subject.id);
    return (
      <TableRow className="mt-5 " key={subject.id}>
        <TableCell className="bg-primary-300">
          <Text className="size-lg font-semibold">{subject.subject.name}</Text>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex flex-col justify-evenly">
            <Text className="size-lg text-center font-semibold">
              {subjectAnalytics?.totalStudents.overall}
            </Text>
            <div className="flex justify-evenly">
              <Text className="text-primary-800">
                M: {subjectAnalytics?.totalStudents.male}
              </Text>
              <Text className="text-primary-800">
                F: {subjectAnalytics?.totalStudents.female}
              </Text>
            </div>
          </div>
        </TableCell>
        <TableCell>
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
        </TableCell>

        <TableCell>
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
        </TableCell>
        <TableCell className="text-center">
          <div className="flex flex-col justify-evenly">
            <Text className="size-lg text-center font-semibold">
              {subjectAnalytics?.absent.overall}
            </Text>
            <div className="flex justify-evenly">
              <Text className="text-primary-800">
                M: {subjectAnalytics?.absent.male}
              </Text>
              <Text className="text-primary-800">
                F: {subjectAnalytics?.absent.female}
              </Text>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Text className="size-lg text-center font-semibold">
              {subjectAnalytics?.averageMark.overall.toFixed(2)}
            </Text>
            <div className="flex justify-evenly">
              <Text className="text-primary-800">
                M: {subjectAnalytics?.averageMark.male.toFixed(2)}
              </Text>
              <Text className="text-primary-800">
                F: {subjectAnalytics?.averageMark.female.toFixed(2)}
              </Text>
            </div>
          </div>
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
          <div className="flex flex-col justify-evenly">
            <Text className="size-lg text-center font-semibold">
              {subjectAnalytics?.numberOfFailStudents.overall}
            </Text>
            <div className="flex justify-evenly">
              <Text className="text-primary-800">
                M: {subjectAnalytics?.numberOfFailStudents.male}
              </Text>
              <Text className="text-primary-800">
                F: {subjectAnalytics?.numberOfFailStudents.female}
              </Text>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Text className="size-lg text-center font-semibold">
              {subjectAnalytics?.passPercentage.overall.toFixed(2)}%
            </Text>
            <div className="flex justify-evenly">
              <Text className="text-primary-800">
                M: {subjectAnalytics?.passPercentage.male.toFixed(2)}%
              </Text>
              <Text className="text-primary-800">
                F: {subjectAnalytics?.passPercentage.female.toFixed(2)}%
              </Text>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Text className="size-lg text-center font-semibold">
              {subjectAnalytics?.failPercentage.overall.toFixed(2)}%
            </Text>
            <div className="flex justify-evenly">
              <Text className="text-primary-800">
                M: {subjectAnalytics?.failPercentage.male.toFixed(2)}%
              </Text>
              <Text className="text-primary-800">
                F: {subjectAnalytics?.failPercentage.female.toFixed(2)}%
              </Text>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Text className="size-lg text-center font-semibold">
              {subjectAnalytics?.highestMark.overall}
            </Text>
            <div className="flex justify-evenly">
              <Text className="text-primary-800">
                M: {subjectAnalytics?.highestMark.male}
              </Text>
              <Text className="text-primary-800">
                F: {subjectAnalytics?.highestMark.female}
              </Text>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Text className="size-lg text-center font-semibold">
              {subjectAnalytics?.lowestMark.overall}
            </Text>
            <div className="flex justify-evenly">
              <Text className="text-primary-800">
                M: {subjectAnalytics?.lowestMark.male}
              </Text>
              <Text className="text-primary-800">
                F: {subjectAnalytics?.lowestMark.female}
              </Text>
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <section>
      {subjectList && (
        <div className="mt-4 space-y-4 overflow-x-auto rounded-md bg-white p-6 print:m-0 print:p-0 ">
          <Table>
            <TableHeader>
              <TableRow className="mt-5 bg-primary-300 text-center">
                <TableCell></TableCell>
                <TableCell className="text-center">Total Count</TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Pending Entry</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Appeared</Text>
                </TableCell>
                <TableCell className="text-center">
                  <Text className="size-lg font-semibold">Absent</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Average</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">No. of Pass</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">No. of Failures</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Pass %</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Failure %</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Highest</Text>
                </TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">Lowest</Text>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjectList.map(renderSubjectRow)}
              <TableRow className="mt-5 bg-green-100 text-center ">
                <TableCell>
                  <Text className="text-center text-lg font-semibold">
                    Overall
                  </Text>
                </TableCell>
                <TableCell className=""></TableCell>
                <TableCell className=""></TableCell>
                <TableCell className=""></TableCell>
                <TableCell className=""></TableCell>
                <TableCell>
                  <Text className="size-lg font-semibold">
                    {overallStats.avgMark?.toFixed(2)}
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
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
