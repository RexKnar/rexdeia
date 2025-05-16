'use client';

import { useGetRangeScalesQuery } from 'lib/queries/analytics/rangeScales/useGetRangeScalesQuery';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button, Switch, Text } from 'ui';
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
import { DataLoadingPlaceholder } from './DataLoadingPlaceholder';

export default function RangeAnalyticsTable({
  subjectList,
  markList,
  classId,
}: {
  subjectList: any[];
  markList: any[];
  classId: string;
}) {
  const [rangeType, setRangeType] = useState('SubjectMarks');
  const [modalStudentList, setModalStudentList] = useState([]);
  const [modalSubjectList, setModalSubjectList] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSubTitle, setModalSubTitle] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: getRangeScaleListResponse, isLoading: isRangeLoading } =
    useGetRangeScalesQuery(
      { rangeType, classId },
      {
        enabled: !!rangeType,
      }
    );

  const getSubjectRangeValue = (
    { startValue, endValue },
    subjectId?: string
  ) => {
    let maleCount = 0;
    let femaleCount = 0;
    let totalCount = 0;
    let overallTotalCount = 0;
    let femalePercentage = 0;
    let malePercentage = 0;
    let overallPercentage = 0;
    let students = [];
    let maleStudents = [];
    let femaleStudents = [];
    if (rangeType === 'SubjectMarks') {
      markList.forEach((student) => {
        student.subjects.forEach((subject) => {
          if (subject.id === subjectId) {
            const mark = parseFloat(subject.subjectTotalMark);

            overallTotalCount++;

            overallTotalCount++;
            if (mark >= startValue && mark <= endValue) {
              if (student.gender.toLowerCase() === 'female') {
                femaleCount++;
                femaleStudents.push(student);
              } else if (student.gender.toLowerCase() === 'male') {
                maleCount++;
                maleStudents.push(student);
              }
              totalCount++;
              students.push(student);
            }
          }
        });
      });
      overallPercentage = (totalCount / overallTotalCount) * 100;
      malePercentage = (maleCount / overallTotalCount) * 100;
      femalePercentage = (femaleCount / overallTotalCount) * 100;

      return {
        totalCount,
        maleCount,
        femaleCount,
        students,
        maleStudents,
        femaleStudents,
        overallPercentage,
        malePercentage,
        femalePercentage,
      };
    } else {
      return {
        totalCount: 0,
        maleCount: 0,
        femaleCount: 0,
        students: [],
        maleStudents: [],
        femaleStudents: [],
      };
    }
  };

  function handleOpenStudentListDialog(
    students: any,
    title: string,
    subTitle: string,
    subjectList?: any[]
  ) {
    let sortedStudents = [...students];
    if (subjectList && subjectList.length > 0) {
      const subjectIdToSortBy = subjectList[0].subject.id;
      sortedStudents.sort((a, b) => {
        const subjectA = a.subjects?.find(
          (sub) => sub.id === subjectIdToSortBy
        );
        const subjectB = b.subjects?.find(
          (sub) => sub.id === subjectIdToSortBy
        );
        const totalA = subjectA?.subjectTotalMark;
        const totalB = subjectB?.subjectTotalMark;
        return totalB - totalA;
      });
    } else {
      sortedStudents.sort((a, b) => {
        const totalA = parseFloat(a.totalMark);
        const totalB = parseFloat(b.totalMark);
        return totalB - totalA;
      });
    }
    setModalStudentList(sortedStudents);
    setModalTitle(title);
    setModalSubTitle(subTitle);
    setModalSubjectList(subjectList || []);

    const params = new URLSearchParams(searchParams.toString());
    params.set('isListDialogOpen', 'true');

    router.replace(pathname + '?' + params.toString());
  }

  const getTotalRangeValue = ({ startValue, endValue }) => {
    let maleCount = 0;
    let femaleCount = 0;
    let totalCount = 0;
    let students = [];
    let maleStudents = [];
    let femaleStudents = [];
    if (rangeType === 'TotalMarks') {
      markList.forEach((student) => {
        const mark = parseFloat(student.totalMark);
        if (mark >= startValue && mark <= endValue) {
          if (student.gender === 'Female') {
            femaleCount++;
            femaleStudents.push(student);
          } else if (student.gender === 'Male') {
            maleCount++;
            maleStudents.push(student);
          }
          totalCount++;
          students.push(student);
        }
      });

      return {
        totalCount,
        maleCount,
        femaleCount,
        students,
        maleStudents,
        femaleStudents,
      };
    } else {
      return {
        totalCount,
        maleCount: 0,
        femaleCount: 0,
        students: [],
        maleStudents: [],
        femaleStudents: [],
      };
    }
  };

  return (
    <section className="space-y-2 rounded-md bg-white p-6">
      {!isRangeLoading ? (
        <section>
          {markList ? (
            <>
              <div className="flex w-full ">
                <div className="items-right float-right flex">
                  <Switch
                    id="rangeType"
                    onCheckedChange={(value) =>
                      setRangeType(value ? 'SubjectMarks' : 'TotalMarks')
                    }
                    checked={rangeType === 'SubjectMarks'}
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 text-sm font-semibold"
                  >
                    {rangeType}
                  </label>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="mt-5 bg-primary-300 text-center">
                    <TableCell></TableCell>
                    {getRangeScaleListResponse?.map((range, index) => (
                      <TableCell key={index}>
                        <Text className="size-lg font-semibold">{`${range.startValue} < ${range.endValue}`}</Text>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rangeType === 'SubjectMarks' &&
                    subjectList?.map((subject, index) => (
                      <TableRow key={index} className="mt-5 ">
                        <TableCell className="sticky left-0 z-10 bg-primary-300">
                          <Text className="size-lg font-semibold">
                            {subject.subject.name}
                          </Text>
                        </TableCell>
                        {getRangeScaleListResponse?.map((range, index) => {
                          const studentDetail = getSubjectRangeValue(
                            range,
                            subject?.subject?.id
                          );
                          return (
                            <TableCell key={index} className="text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  <Button
                                    variant="ghost"
                                    className="size-lg text-center font-semibold text-black"
                                    onClick={() => {
                                      handleOpenStudentListDialog(
                                        studentDetail.students,
                                        `Students in Total Marks - ${range.startValue} < Mark <= ${range.endValue}`,
                                        `Total Students: ${studentDetail.totalCount}`,
                                        [subject]
                                      );
                                    }}
                                  >{`${studentDetail?.totalCount} (${studentDetail?.overallPercentage.toFixed(2)}%)`}</Button>
                                </Text>
                                <div className="flex justify-evenly">
                                  <Text className="text-primary-800">
                                    <Button
                                      variant="ghost"
                                      className="size-lg text-center font-semibold text-primary-800"
                                      onClick={() => {
                                        handleOpenStudentListDialog(
                                          studentDetail.maleStudents,
                                          `Male Students in ${subject.subject.name} - ${range.startValue} < Mark <= ${range.endValue}`,
                                          `Total Male Students: ${studentDetail.maleCount}`,
                                          [subject]
                                        );
                                      }}
                                    >
                                      M:
                                      {`${studentDetail?.maleCount} (${studentDetail?.malePercentage.toFixed(2)}%)`}
                                    </Button>
                                  </Text>
                                  <Text className="text-primary-800">
                                    <Button
                                      variant="ghost"
                                      className="size-lg text-center font-semibold text-primary-800"
                                      onClick={() =>
                                        handleOpenStudentListDialog(
                                          studentDetail.femaleStudents,
                                          `Female Students in ${subject.subject.name} - ${range.startValue} < Mark <= ${range.endValue}`,
                                          `Total Female Students: ${studentDetail.femaleCount}`,
                                          [subject]
                                        )
                                      }
                                    >
                                      F:
                                      {`${studentDetail?.femaleCount} (${studentDetail?.femalePercentage.toFixed(2)}%)`}
                                    </Button>
                                  </Text>
                                </div>
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  {rangeType === 'TotalMarks' && (
                    <TableRow className="mt-5 bg-green-100 text-center ">
                      <TableCell>
                        <Text className="text-center text-lg font-semibold">
                          Overall
                        </Text>
                      </TableCell>
                      {getRangeScaleListResponse?.map((range, index) => {
                        const studentDetail = getTotalRangeValue(range);
                        return (
                          <TableCell key={index}>
                            <div className="flex flex-col justify-evenly">
                              <Text className="size-lg text-center font-semibold">
                                <Button
                                  variant="ghost"
                                  className="size-lg text-center font-semibold text-black"
                                  onClick={() =>
                                    handleOpenStudentListDialog(
                                      studentDetail.students,
                                      `Students in Total Marks - ${range.startValue} < Mark <= ${range.endValue}`,
                                      `Total Students: ${studentDetail.totalCount}`
                                    )
                                  }
                                >{`${studentDetail?.totalCount}`}</Button>
                              </Text>
                              <div className="flex justify-evenly">
                                <Text className="text-primary-800">
                                  <Button
                                    variant="ghost"
                                    className="size-lg text-center font-semibold text-primary-800"
                                    onClick={() =>
                                      handleOpenStudentListDialog(
                                        studentDetail.maleStudents,
                                        `Male Students in Total Marks - ${range.startValue} < Mark <= ${range.endValue}`,
                                        `Total Male Students: ${studentDetail.maleCount}`
                                      )
                                    }
                                  >
                                    {' '}
                                    M: {`${studentDetail?.maleCount}`}
                                  </Button>
                                </Text>
                                <Text className="text-primary-800">
                                  <Button
                                    variant="ghost"
                                    className="size-lg text-center font-semibold text-primary-800"
                                    onClick={() =>
                                      handleOpenStudentListDialog(
                                        studentDetail.femaleStudents,
                                        `Female Students in Total Marks - ${range.startValue} < Mark <= ${range.endValue}`,
                                        `Total Female Students: ${studentDetail.femaleCount}`
                                      )
                                    }
                                  >
                                    {' '}
                                    F: {`${studentDetail?.femaleCount}`}
                                  </Button>
                                </Text>
                              </div>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <OverallStudentListDialog
                studentList={modalStudentList}
                title={modalTitle}
                subTitle={modalSubTitle}
                subjectList={modalSubjectList}
              />
            </>
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
    </section>
  );
}
