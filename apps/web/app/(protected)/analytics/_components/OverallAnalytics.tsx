/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useGetExamSubjectsByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectsByClassSectionIdQuery';
import { TableIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

import noDataFoundSvg from '../../../../public/assets/images/analytics-empty-state_Artboard_1.svg';
import dataSegmentationGif from '../../../../public/assets/images/data-segmentation.gif';
import { OverallStudentListDialog } from '../_modals/OverallStudentListDialog';
import { Analytics } from '../typeDefinition/Analytics';
import { downloadSubjectWiseOverallXLSX } from '../XLSX/excelExports';
import { DataLoadingPlaceholder } from './DataLoadingPlaceholder';

const calculatePercentage = (part: number, whole: number) =>
  whole > 0 ? (part / whole) * 100 : 0;

export default function OverallAnalytics({
  students,
  classId,
  examId,
  sectionId,
  examDetails,
  sectionDetails,
  classDetails,
}: {
  students: any;
  classId: string;
  sectionId?: string;
  examId: string;
  examDetails: any;
  sectionDetails: any;
  classDetails: any;
}) {
  const [analytics, setAnalytics] = useState<Map<string, Analytics>>(new Map());
  const [modalStudentList, setModalStudentList] = useState([]);
  const [modalSubjectList, setModalSubjectList] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSubTitle, setModalSubTitle] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const { data: subjectList, isLoading: isSubjectLoading } =
    useGetExamSubjectsByClassSectionIdQuery(
      sectionId ? { examId, classId, sectionId } : { examId, classId },
      { enabled: !!examId && !!classId }
    );

  const analyzeSubjectPerformance = useCallback(
    (subjectId: string, partitionCount: number): Analytics => {
      const result: Analytics = {
        numberOfPassStudents: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        numberOfFailStudents: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        totalFailExcludingAbsent: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        highestMark: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        highestMarkStudentName: {
          male: '',
          female: '',
          overall: '',
          studentList: { male: [], female: [], overall: [] },
        },
        lowestMark: {
          male: Infinity,
          female: Infinity,
          overall: Infinity,
          studentList: { male: [], female: [], overall: [] },
        },
        lowestMarkStudentName: {
          male: '',
          female: '',
          overall: '',
          studentList: { male: [], female: [], overall: [] },
        },
        averageMark: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        averageMarkAppeared: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        passPercentage: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        failPercentage: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        passPercentageExcludingAbsent: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        failPercentageExcludingAbsent: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        attendance: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        absent: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        overallAbsent: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        markEntry: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        totalStudents: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
        centum: {
          male: 0,
          female: 0,
          overall: 0,
          studentList: { male: [], female: [], overall: [] },
        },
      };

      let totalMarks = { male: 0, female: 0, overall: 0 };
      let totalStudents = { male: 0, female: 0, overall: 0 };

      students.forEach((student) => {
        const { subjects: studentSubjects, ...rest } = student;
        const subject = studentSubjects.find((subj) => subj.id === subjectId);
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
        result.totalStudents.studentList[gender].push(student);
        totalStudents.overall++;

        if (!subject.absentStatus && subject?.marks?.length > 0) {
          result.attendance[gender]++;
          result.attendance.overall++;
          result.attendance.studentList.overall.push(student);
          result.attendance.studentList[gender].push(student);
        } else if (subject.absentStatus && subject?.marks?.length > 0) {
          result.absent[gender]++;
          result.absent.overall++;
          result.absent.studentList.overall.push(student);
          result.absent.studentList[gender].push(student);
          result.overallAbsent[gender]++;
          result.overallAbsent.overall++;
          result.overallAbsent.studentList.overall.push(student);
          result.overallAbsent.studentList[gender].push(student);
        }
        if (subject?.marks?.length === 0) {
          result.markEntry[gender]++;
          result.markEntry.overall++;
          result.markEntry.studentList.overall.push(student);
          result.markEntry.studentList[gender].push(student);
        }

        if (mark > result.highestMark[gender]) {
          result.highestMark[gender] = mark;
          result.highestMarkStudentName[gender] = studentFullName;

          result.highestMark.studentList[gender] = [student];
        } else {
          if (mark == result.highestMark[gender]) {
            result.highestMark.studentList[gender].push(student);
          }
        }
        if (mark < result.lowestMark[gender] && !subject.absentStatus) {
          result.lowestMark[gender] = mark;
          result.lowestMarkStudentName[gender] = studentFullName;

          result.lowestMark.studentList[gender] = [student];
        } else {
          if (mark == result.lowestMark[gender]) {
            result.lowestMark.studentList[gender].push(student);
          }
        }

        if (mark > result.highestMark['overall']) {
          result.highestMark['overall'] = mark;
          result.highestMarkStudentName['overall'] = studentFullName;
          result.highestMark.studentList.overall = [student];
        } else {
          if (mark == result.highestMark['overall']) {
            result.highestMark.studentList.overall.push(student);
          }
        }
        if (mark < result.lowestMark['overall'] && !subject.absentStatus) {
          result.lowestMark['overall'] = mark;
          result.lowestMarkStudentName['overall'] = studentFullName;
          result.lowestMark.studentList.overall = [student];
        } else {
          if (result.lowestMark['overall'] == mark) {
            result.lowestMark.studentList.overall.push(student);
          }
        }

        if (
          (subject.absentStatus || subject.failingStatus) &&
          subject?.marks?.length > 0
        ) {
          result.numberOfFailStudents[gender]++;
          result.numberOfFailStudents.overall++;
          result.numberOfFailStudents.studentList.overall.push(student);
          result.numberOfFailStudents.studentList[gender].push(student);
        }
        if (subject.failingStatus && !subject.absentStatus) {
          result.totalFailExcludingAbsent[gender]++;
          result.totalFailExcludingAbsent.overall++;
          result.totalFailExcludingAbsent.studentList.overall.push(student);
          result.totalFailExcludingAbsent.studentList[gender].push(student);
        } else if (!subject.failingStatus && !subject.absentStatus) {
          result.numberOfPassStudents[gender]++;
          result.numberOfPassStudents.overall++;
          result.numberOfPassStudents.studentList.overall.push(student);
          result.numberOfPassStudents.studentList[gender].push(student);
        }

        if (
          subject.centum &&
          !subject.failingStatus &&
          !subject.absentStatus &&
          subject?.marks?.length === partitionCount
        ) {
          result.centum[gender]++;
          result.centum.overall++;
          result.centum.studentList.overall.push(student);
          result.centum.studentList[gender].push(student);
        }
      });

      ['male', 'female', 'overall'].forEach((category) => {
        if (totalStudents[category] > 0) {
          result.averageMark[category] =
            totalMarks[category] / totalStudents[category];
          result.averageMarkAppeared[category] =
            totalMarks[category] / totalStudents[category] -
            result.absent[category];
          result.lowestMark[category] =
            result.lowestMark[category] === Infinity
              ? 0
              : result.lowestMark[category];
          result.passPercentageExcludingAbsent[category] = calculatePercentage(
            result.numberOfPassStudents[category],
            result?.attendance[category]
          );
          result.failPercentageExcludingAbsent[category] = calculatePercentage(
            result.numberOfFailStudents[category],
            result?.attendance[category]
          );

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
          analyzeSubjectPerformance(
            subject.subject.id,
            subject?.examSubjectPartition?.length ?? 0
          )
        );
      });
      setAnalytics(newAnalytics);
    }
  }, [students, subjectList]);

  const overallStats = useMemo(() => {
    let totalMarks = 0,
      appearedTotalMarks = 0,
      totalStudents = 0,
      totalPass = 0,
      totalPassStudents = [],
      totalFail = 0,
      totalFailExcludingAbsent = 0,
      totalFailStudents = [],
      totalFailExcludingAbsentStudents = [],
      highestMark = 0,
      highestMarkStudents = [],
      lowestMark = 0,
      lowestMarkStudents = [],
      isFirst = true,
      overallAbsent = 0;

    students.forEach((student) => {
      if (student.overallAbsentStatus) {
        overallAbsent++;
      } else {
        appearedTotalMarks += student.totalMark;
      }
      totalMarks += student.totalMark;

      totalStudents++;
      if (student.failingStatus) {
        totalFail++;
        totalFailStudents.push(student);
        if (!student.overallAbsentStatus) {
          totalFailExcludingAbsent++;
          totalFailExcludingAbsentStudents.push(student);
        }
      } else {
        totalPass++;
        totalPassStudents.push(student);
      }

      let oldHighestMark = highestMark;
      if (student.totalMark == highestMark) {
        highestMarkStudents.push(student);
      } else {
        highestMark = Math.max(highestMark, student.totalMark);
        if (highestMark != oldHighestMark) {
          highestMarkStudents = [student];
        }
      }

      if (student.attendance) {
        if (isFirst) {
          lowestMark = student.totalMark;
          isFirst = false;
        } else {
          let oldLowestMark = lowestMark;
          if (lowestMark == student.totalMark) {
            lowestMarkStudents.push(student);
          } else {
            lowestMark = Math.min(lowestMark, student.totalMark);
            if (lowestMark != oldLowestMark) {
              lowestMarkStudents = [student];
            }
          }
        }
      }
    });

    return {
      avgMark: totalStudents > 0 ? totalMarks / totalStudents : 0,
      appearedAvgMark: appearedTotalMarks / (totalStudents - overallAbsent),
      totalPass: { count: totalPass, students: totalPassStudents },
      totalFail: { count: totalFail, students: totalFailStudents },
      totalFailExcludingAbsent: {
        count: totalFail - overallAbsent,
        students: totalFailExcludingAbsentStudents,
      },
      passCount: totalPass,
      failCount: totalFail,
      passPercentage: calculatePercentage(totalPass, totalStudents),
      failPercentage: calculatePercentage(totalFail, totalStudents),
      passPercentageExcludingAbsent: calculatePercentage(
        totalPass,
        totalStudents - overallAbsent
      ),
      failPercentageExcludingAbsent: calculatePercentage(
        totalFail - overallAbsent,
        totalStudents - overallAbsent
      ),
      highest: { mark: highestMark, students: highestMarkStudents },
      lowest: { mark: lowestMark, students: lowestMarkStudents },
      highestMark,
      lowestMark,
    };
  }, [students]);

  function handleOpenStudentListDialog(
    students: any,
    title: string,
    subTitle: string,
    subjectList?: any
  ) {
    setModalStudentList(students);
    setModalTitle(title);
    setModalSubTitle(subTitle);
    setModalSubjectList(subjectList);
    params.set('isListDialogOpen', 'true');

    router.replace(pathname + '?' + params.toString());
  }

  const renderSubjectRow = (subject) => {
    const subjectAnalytics = analytics.get(subject.id);
    return (
      <TableRow className="mt-5 " key={subject.id}>
        <TableCell className="sticky left-0 z-10 bg-primary-300">
          <Text className="size-lg font-semibold">{subject.subject.name}</Text>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex flex-col justify-evenly">
            <Text className="size-lg text-center font-semibold">
              {subjectAnalytics?.totalStudents.overall}
            </Text>
            <div className="flex justify-evenly">
              <Button
                variant="ghost"
                className="size-lg text-center font-semibold text-primary-800"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.totalStudents.studentList.male,
                    'Total Students',
                    'Male',
                    [subject]
                  )
                }
              >
                M: {subjectAnalytics?.totalStudents.male}
              </Button>
              <Button
                variant="ghost"
                className="size-lg text-center font-semibold text-primary-800"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.totalStudents.studentList.female,
                    'Total Students',
                    'Female',
                    [subject]
                  )
                }
              >
                F: {subjectAnalytics?.totalStudents.female}
              </Button>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Button
              variant="ghost"
              className="size-lg text-center font-semibold"
              onClick={() =>
                handleOpenStudentListDialog(
                  subjectAnalytics.markEntry.studentList.overall,
                  'Pending Mark Entry List',
                  'Overall',
                  [subject]
                )
              }
            >
              {subjectAnalytics?.markEntry.overall}
            </Button>
            <div className="size-lg flex justify-evenly text-center text-primary-800">
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.markEntry.studentList.male,
                    'Pending Mark Entry List',
                    'Male',
                    [subject]
                  )
                }
              >
                M: {subjectAnalytics?.markEntry.male}
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.markEntry.studentList.female,
                    'Pending Mark Entry List',
                    'Female',
                    [subject]
                  )
                }
              >
                F: {subjectAnalytics?.markEntry.female}
              </Button>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Button
              variant="ghost"
              onClick={() =>
                handleOpenStudentListDialog(
                  subjectAnalytics.attendance.studentList.overall,
                  'Appeared Students List',
                  'Overall',
                  [subject]
                )
              }
            >
              <Text className="size-lg text-center font-semibold">
                {subjectAnalytics?.attendance.overall}
              </Text>
            </Button>
            <div className="flex justify-evenly text-primary-800">
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.attendance.studentList.male,
                    'Appeared Students List',
                    'Male',
                    [subject]
                  )
                }
              >
                M: {subjectAnalytics?.attendance.male}
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.attendance.studentList.female,
                    'Appeared Students List',
                    'Female',
                    [subject]
                  )
                }
              >
                F: {subjectAnalytics?.attendance.female}
              </Button>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex flex-col justify-evenly">
            <Button
              variant="ghost"
              className="size-lg text-center font-semibold"
              onClick={() =>
                handleOpenStudentListDialog(
                  subjectAnalytics.absent.studentList.overall,
                  'Absent Students List',
                  'Overall',
                  [subject]
                )
              }
            >
              {subjectAnalytics?.absent.overall}
            </Button>
            <div className="flex justify-evenly text-primary-800">
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.absent.studentList.male,
                    'Absent Students List',
                    'Male',
                    [subject]
                  )
                }
              >
                M: {subjectAnalytics?.absent.male}
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.absent.studentList.female,
                    'Absent Students List',
                    'Female',
                    [subject]
                  )
                }
              >
                F: {subjectAnalytics?.absent.female}
              </Button>
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
              {subjectAnalytics?.averageMarkAppeared.overall.toFixed(2)}
            </Text>
            <div className="flex justify-evenly">
              <Text className="text-primary-800">
                M: {subjectAnalytics?.averageMarkAppeared.male.toFixed(2)}
              </Text>
              <Text className="text-primary-800">
                F: {subjectAnalytics?.averageMarkAppeared.female.toFixed(2)}
              </Text>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Button
              variant="ghost"
              onClick={() =>
                handleOpenStudentListDialog(
                  subjectAnalytics.numberOfPassStudents.studentList.overall,
                  'Passed Students List',
                  'Overall',
                  [subject]
                )
              }
            >
              <Text className="size-lg text-center font-semibold">
                {subjectAnalytics?.numberOfPassStudents.overall}
              </Text>
            </Button>
            <div className="flex justify-evenly text-primary-800">
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.numberOfPassStudents.studentList.male,
                    'Passed Students List',
                    'Male',
                    [subject]
                  )
                }
              >
                M: {subjectAnalytics?.numberOfPassStudents.male}
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.numberOfPassStudents.studentList.male,
                    'Passed Students List',
                    'Female',
                    [subject]
                  )
                }
              >
                F: {subjectAnalytics?.numberOfPassStudents.female}
              </Button>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Button
              variant="ghost"
              className="size-lg text-center font-semibold"
              onClick={() =>
                handleOpenStudentListDialog(
                  subjectAnalytics.numberOfFailStudents.studentList.overall,
                  'Failed Students List',
                  'Overall',
                  [subject]
                )
              }
            >
              {subjectAnalytics?.numberOfFailStudents.overall}
            </Button>
            <div className="flex justify-evenly text-primary-800">
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.numberOfFailStudents.studentList.male,
                    'Failed Students List',
                    'Male',
                    [subject]
                  )
                }
              >
                M: {subjectAnalytics?.numberOfFailStudents.male}
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.numberOfFailStudents.studentList.female,
                    'Failed Students List',
                    'Female',
                    [subject]
                  )
                }
              >
                F: {subjectAnalytics?.numberOfFailStudents.female}
              </Button>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Button
              variant="ghost"
              className="size-lg text-center font-semibold"
              onClick={() =>
                handleOpenStudentListDialog(
                  subjectAnalytics.totalFailExcludingAbsent.studentList.overall,
                  'Failed Students List',
                  'Overall',
                  [subject]
                )
              }
            >
              {subjectAnalytics?.totalFailExcludingAbsent.overall}
            </Button>
            <div className="flex justify-evenly text-primary-800">
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.totalFailExcludingAbsent.studentList.male,
                    'Failed Students List',
                    'Male',
                    [subject]
                  )
                }
              >
                M: {subjectAnalytics?.totalFailExcludingAbsent.male}
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.totalFailExcludingAbsent.studentList
                      .female,
                    'Failed Students List',
                    'Female',
                    [subject]
                  )
                }
              >
                F: {subjectAnalytics?.totalFailExcludingAbsent.female}
              </Button>
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
              {subjectAnalytics?.passPercentageExcludingAbsent.overall.toFixed(
                2
              )}
              %
            </Text>
            <div className="flex justify-evenly">
              <Text className="text-primary-800">
                M:{' '}
                {subjectAnalytics?.passPercentageExcludingAbsent.male.toFixed(
                  2
                )}
                %
              </Text>
              <Text className="text-primary-800">
                F:{' '}
                {subjectAnalytics?.passPercentageExcludingAbsent.female.toFixed(
                  2
                )}
                %
              </Text>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Text className="size-lg text-center font-semibold">
              {subjectAnalytics?.failPercentageExcludingAbsent.overall.toFixed(
                2
              )}
              %
            </Text>
            <div className="flex justify-evenly">
              <Text className="text-primary-800">
                M:{' '}
                {subjectAnalytics?.failPercentageExcludingAbsent.male.toFixed(
                  2
                )}
                %
              </Text>
              <Text className="text-primary-800">
                F:{' '}
                {subjectAnalytics?.failPercentageExcludingAbsent.female.toFixed(
                  2
                )}
                %
              </Text>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Button
              variant="ghost"
              onClick={() =>
                handleOpenStudentListDialog(
                  subjectAnalytics.highestMark.studentList.overall,
                  'Highest Mark List',
                  'Overall',
                  [subject]
                )
              }
            >
              <Text className="size-lg text-center font-semibold">
                {subjectAnalytics?.highestMark.overall}
              </Text>
            </Button>
            <div className="flex justify-evenly">
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.highestMark.studentList.male,
                    'Highest Mark List',
                    'Male',
                    [subject]
                  )
                }
              >
                M: {subjectAnalytics?.highestMark.male}
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.highestMark.studentList.female,
                    'Highest Mark List',
                    'Female',
                    [subject]
                  )
                }
              >
                F: {subjectAnalytics?.highestMark.female}
              </Button>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Button
              variant="ghost"
              onClick={() =>
                handleOpenStudentListDialog(
                  subjectAnalytics.lowestMark.studentList.overall,
                  'Lowest Mark List',
                  'Overall',
                  [subject]
                )
              }
            >
              <Text className="size-lg text-center font-semibold">
                {subjectAnalytics?.lowestMark.overall}
              </Text>
            </Button>
            <div className="flex justify-evenly text-primary-800">
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.lowestMark.studentList.male,
                    'Lowest Mark List',
                    'Male',
                    [subject]
                  )
                }
              >
                M: {subjectAnalytics?.lowestMark.male}
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.lowestMark.studentList.female,
                    'Lowest Mark List',
                    'Female',
                    [subject]
                  )
                }
              >
                F: {subjectAnalytics?.lowestMark.female}
              </Button>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col justify-evenly">
            <Button
              variant="ghost"
              onClick={() =>
                handleOpenStudentListDialog(
                  subjectAnalytics.centum.studentList.overall,
                  'Centum List',
                  'Overall',
                  [subject]
                )
              }
            >
              <Text className="size-lg text-center font-semibold">
                {subjectAnalytics?.centum.overall}
              </Text>
            </Button>
            <div className="flex justify-evenly text-primary-800">
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.centum.studentList.male,
                    'Centum List',
                    'Male',
                    [subject]
                  )
                }
              >
                M: {subjectAnalytics?.centum.male}
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  handleOpenStudentListDialog(
                    subjectAnalytics.centum.studentList.female,
                    'Centum List',
                    'Female',
                    [subject]
                  )
                }
              >
                F: {subjectAnalytics?.centum.female}
              </Button>
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <section className="space-y-2 rounded-md bg-white p-6">
      {!isSubjectLoading ? (
        <section>
          {subjectList ? (
            <div className="space-y-4 overflow-x-auto rounded-md bg-white p-6 print:m-0 print:p-0">
              <Button
                variant="outline"
                onClick={() =>
                  downloadSubjectWiseOverallXLSX(
                    subjectList,
                    analytics,
                    examDetails,
                    classDetails,
                    overallStats,
                    sectionDetails
                  )
                }
              >
                Download XLSX <TableIcon className="ml-2 h-4 w-4" />
              </Button>
              <Table>
                <TableHeader>
                  <TableRow className="mt-5 bg-primary-300 text-center">
                    <TableCell></TableCell>
                    <TableCell className="text-center">Total Count</TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">
                        Pending Entry
                      </Text>
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
                      <Text className="size-lg font-semibold">
                        Average(App)
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">No. of Pass</Text>
                    </TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">
                        No. of Failures
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">
                        No. of Failures(App)
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">Pass %</Text>
                    </TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">Failure %</Text>
                    </TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">Pass(App) %</Text>
                    </TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">
                        Failure(App) %
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">Highest</Text>
                    </TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">Lowest</Text>
                    </TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">Centum</Text>
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
                    <TableCell className="">
                      {overallStats.appearedAvgMark?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleOpenStudentListDialog(
                            overallStats.totalPass.students,
                            'Total Pass List',
                            'Overall',
                            subjectList
                          )
                        }
                      >
                        <Text className="size-lg font-semibold">
                          {overallStats.totalPass.count}
                        </Text>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleOpenStudentListDialog(
                            overallStats.totalFail.students,
                            'Total Fail List',
                            'Overall',
                            subjectList
                          )
                        }
                      >
                        <Text className="size-lg font-semibold">
                          {overallStats.totalFail.count}
                        </Text>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleOpenStudentListDialog(
                            overallStats.totalFailExcludingAbsent.students,
                            'Total Fail List',
                            'Overall',
                            subjectList
                          )
                        }
                      >
                        <Text className="size-lg font-semibold">
                          {overallStats.totalFailExcludingAbsent.count}
                        </Text>
                      </Button>
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
                        {overallStats.passPercentageExcludingAbsent?.toFixed(2)}
                        %
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">
                        {overallStats.failPercentageExcludingAbsent?.toFixed(2)}
                        %
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleOpenStudentListDialog(
                            overallStats.highest.students,
                            'Highest Mark List',
                            'Overall',
                            subjectList
                          )
                        }
                      >
                        <Text className="size-lg font-semibold">
                          {overallStats.highest.mark}
                        </Text>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleOpenStudentListDialog(
                            overallStats.lowest.students,
                            'Lowest Mark List',
                            'Overall',
                            subjectList
                          )
                        }
                      >
                        <Text className="size-lg font-semibold">
                          {overallStats.lowest.mark}
                        </Text>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Text className="size-lg font-semibold">-</Text>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <DataLoadingPlaceholder
              image={noDataFoundSvg}
              description="It looks like there are no analytics details available at the moment."
            />
          )}
        </section>
      ) : (
        <DataLoadingPlaceholder
          image={dataSegmentationGif}
          description="Please wait while we fetch the data for you..."
        />
      )}
      <OverallStudentListDialog
        studentList={modalStudentList}
        title={modalTitle}
        subTitle={modalSubTitle}
        subjectList={modalSubjectList}
      />
    </section>
  );
}
