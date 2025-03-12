'use client';

import { DataLoadingPlaceholder } from 'app/(protected)/analytics/_components/DataLoadingPlaceholder';
import { useGetRangeScalesQuery } from 'lib/queries/analytics/rangeScales/useGetRangeScalesQuery';
import { useState } from 'react';
import { Switch, Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

import noDataFoundSvg from '../../../../../../../public/assets/images/analytics-empty-state_Artboard_1.svg';
import dataSegmentationGif from '../../../../../../../public/assets/images/data-segmentation.gif';

export default function RangeAnalyticsTable({
  subjectList,
  markList,
}: {
  subjectList: any[];
  markList: any[];
}) {
  const [rangeType, setRangeType] = useState('SubjectMarks');
  const { data: getRangeScaleListResponse, isLoading: isRangeLoading } =
    useGetRangeScalesQuery(rangeType, {
      enabled: !!rangeType,
    });

  const getSubjectRangeValue = (
    { startValue, endValue },
    subjectID?: string
  ) => {
    let maleCount = 0;
    let femaleCount = 0;
    let totalCount = 0;
    if (rangeType === 'SubjectMarks') {
      markList.forEach((student) => {
        student.subjects.forEach((subject) => {
          if (subject.id === subjectID) {
            const mark = parseFloat(subject.subjectTotalMark);
            if (mark >= startValue && mark <= endValue) {
              if (student.gender.toLowerCase() === 'female') {
                femaleCount++;
              } else if (student.gender.toLowerCase() === 'male') {
                maleCount++;
              }
              totalCount++;
            }
          }
        });
      });

      return {
        totalCount,
        maleCount,
        femaleCount,
      };
    } else {
      return {
        totalCount: 0,
        maleCount: 0,
        femaleCount: 0,
      };
    }
  };

  const getTotalRangeValue = ({ startValue, endValue }) => {
    let maleCount = 0;
    let femaleCount = 0;
    let totalCount = 0;
    if (rangeType === 'TotalMarks') {
      markList.forEach((student) => {
        const mark = parseFloat(student.totalMark);
        if (mark >= startValue && mark <= endValue) {
          if (student.gender === 'Female') {
            femaleCount++;
          } else if (student.gender === 'Male') {
            maleCount++;
          }
          totalCount++;
        }
      });

      return {
        totalCount,
        maleCount,
        femaleCount,
      };
    } else {
      return {
        totalCount,
        maleCount,
        femaleCount,
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
                        <TableCell className="bg-primary-300">
                          <Text className="size-lg font-semibold">
                            {subject.name}
                          </Text>
                        </TableCell>
                        {getRangeScaleListResponse?.map((range, index) => {
                          const studentDetail = getSubjectRangeValue(
                            range,
                            subject?.id
                          );
                          return (
                            <TableCell key={index} className="text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {`${studentDetail?.totalCount}`}
                                </Text>
                                <div className="flex justify-evenly">
                                  <Text className="text-primary-800">
                                    M: {`${studentDetail?.maleCount}`}
                                  </Text>
                                  <Text className="text-primary-800">
                                    F: {`${studentDetail?.femaleCount}`}
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
                                {`${studentDetail?.totalCount}`}
                              </Text>
                              <div className="flex justify-evenly">
                                <Text className="text-primary-800">
                                  M: {`${studentDetail?.maleCount}`}
                                </Text>
                                <Text className="text-primary-800">
                                  F: {`${studentDetail?.femaleCount}`}
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
