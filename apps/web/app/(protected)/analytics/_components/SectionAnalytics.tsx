import { useGetExamAnalyticsSectionMasterQuery } from 'lib/queries/analytics/exam/useGetSectionAnalyticsMasterQuery';
import { Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

import dataSegmentationGif from '../../../../public/assets/images/data-segmentation.gif';
import { DataLoadingPlaceholder } from './DataLoadingPlaceholder';

export default function SectionAnalytics({
  classId,
  examId,
}: {
  classId: string;
  sectionId?: string;
  examId: string;
}) {
  const { data: analyticsList, isLoading: isAnalyticsLoading } =
    useGetExamAnalyticsSectionMasterQuery(
      {
        examId,
        classId,
      },
      { enabled: !!examId && !!classId }
    );
  return (
    <section className="space-y-2 rounded-md bg-white p-6">
      {!isAnalyticsLoading ? (
        <section>
          {analyticsList && (
            <div className="mt-4 w-full space-y-4 overflow-auto rounded-md bg-white p-6 print:m-0 print:p-0">
              <Table className="overflow-scroll ">
                <TableHeader className=" bg-primary-300">
                  <TableRow className="text-center">
                    <TableCell className="w-[100px] text-center"></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="w-[150px] text-center">
                      <Text className="size-lg text-center font-semibold">
                        Staff
                      </Text>
                    </TableCell>
                    <TableCell className="w-[150px] text-center">
                      <Text className="size-lg font-semibold">
                        Total Students
                      </Text>
                    </TableCell>
                    <TableCell className="w-[150px] text-center">
                      <Text className="size-lg font-semibold">
                        Pending Entry
                      </Text>
                    </TableCell>
                    <TableCell className="w-[150px] text-center">
                      <Text className="size-lg font-semibold">Appeared</Text>
                    </TableCell>
                    <TableCell className="w-[150px] text-center">
                      <Text className="size-lg font-semibold">Absent</Text>
                    </TableCell>
                    <TableCell className="w-[150px] text-center">
                      <Text className="size-lg font-semibold">Average</Text>
                    </TableCell>
                    <TableCell className="w-[150px] text-center">
                      <Text className="size-lg font-semibold">No. of Pass</Text>
                    </TableCell>
                    <TableCell className="w-[150px] text-center">
                      <Text className="size-lg font-semibold">
                        No. of Failures
                      </Text>
                    </TableCell>
                    <TableCell className="w-[150px] text-center">
                      <Text className="size-lg font-semibold">Pass %</Text>
                    </TableCell>
                    <TableCell className="w-[150px] text-center">
                      <Text className="size-lg font-semibold">Failure %</Text>
                    </TableCell>
                    <TableCell className="w-[150px] text-center">
                      <Text className="size-lg font-semibold">Highest</Text>
                    </TableCell>
                    <TableCell className="w-[150px] text-center">
                      <Text className="size-lg font-semibold">Lowest</Text>
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {analyticsList?.map((detailedAnalytics) => {
                    const { subject, analytics: analyticsDetails } =
                      detailedAnalytics;
                    return (
                      <>
                        {analyticsDetails.map((subjectAnalytics, index) => (
                          <TableRow key={subject.id}>
                            {index === 0 && (
                              <TableCell
                                className="sticky left-0 z-10 w-[100px] bg-primary-300"
                                rowSpan={analyticsDetails.length}
                              >
                                <Text className="size-lg font-semibold">
                                  {subject.name}
                                </Text>
                              </TableCell>
                            )}
                            <TableCell className="sticky left-[57px] z-10 w-[50px] bg-amber-300 text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {subjectAnalytics?.section.name}
                                </Text>
                              </div>
                            </TableCell>
                            <TableCell className="w-[150px] text-center ">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {subjectAnalytics?.section.staff?.firstName}{' '}
                                  {subjectAnalytics?.section.staff?.lastName}
                                </Text>
                              </div>
                            </TableCell>
                            <TableCell className="w-[150px] text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {subjectAnalytics?.totalStudents?.overall}
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
                            <TableCell className="w-[150px] text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {subjectAnalytics?.markEntry?.overall}
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
                            <TableCell className="w-[150px] text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {subjectAnalytics?.attendance?.overall}
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
                            <TableCell className="w-[150px] text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {subjectAnalytics?.absent?.overall}
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
                            <TableCell className="w-[150px] text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {subjectAnalytics?.averageMark?.overall.toFixed(
                                    2
                                  )}
                                </Text>
                                <div className="flex justify-evenly">
                                  <Text className="text-primary-800">
                                    M:{' '}
                                    {subjectAnalytics?.averageMark.male.toFixed(
                                      2
                                    )}
                                  </Text>
                                  <Text className="text-primary-800">
                                    F:{' '}
                                    {subjectAnalytics?.averageMark.female.toFixed(
                                      2
                                    )}
                                  </Text>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="w-[150px] text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {
                                    subjectAnalytics?.numberOfPassStudents
                                      ?.overall
                                  }
                                </Text>
                                <div className="flex justify-evenly">
                                  <Text className="text-primary-800">
                                    M:{' '}
                                    {
                                      subjectAnalytics?.numberOfPassStudents
                                        .male
                                    }
                                  </Text>
                                  <Text className="text-primary-800">
                                    F:{' '}
                                    {
                                      subjectAnalytics?.numberOfPassStudents
                                        .female
                                    }
                                  </Text>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="w-[150px] text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {
                                    subjectAnalytics?.numberOfFailStudents
                                      ?.overall
                                  }
                                </Text>
                                <div className="flex justify-evenly">
                                  <Text className="text-primary-800">
                                    M:{' '}
                                    {
                                      subjectAnalytics?.numberOfFailStudents
                                        .male
                                    }
                                  </Text>
                                  <Text className="text-primary-800">
                                    F:{' '}
                                    {
                                      subjectAnalytics?.numberOfFailStudents
                                        .female
                                    }
                                  </Text>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="w-[150px] text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {subjectAnalytics?.passPercentage?.overall.toFixed(
                                    2
                                  )}
                                  %
                                </Text>
                                <div className="flex justify-evenly">
                                  <Text className="text-primary-800">
                                    M:{' '}
                                    {subjectAnalytics?.passPercentage.male.toFixed(
                                      2
                                    )}
                                    %
                                  </Text>
                                  <Text className="text-primary-800">
                                    F:{' '}
                                    {subjectAnalytics?.passPercentage.female.toFixed(
                                      2
                                    )}
                                    %
                                  </Text>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="w-[150px] text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {subjectAnalytics?.failPercentage?.overall.toFixed(
                                    2
                                  )}
                                  %
                                </Text>
                                <div className="flex justify-evenly">
                                  <Text className="text-primary-800">
                                    M:{' '}
                                    {subjectAnalytics?.failPercentage.male.toFixed(
                                      2
                                    )}
                                    %
                                  </Text>
                                  <Text className="text-primary-800">
                                    F:{' '}
                                    {subjectAnalytics?.failPercentage.female.toFixed(
                                      2
                                    )}
                                    %
                                  </Text>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="w-[150px] text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {subjectAnalytics?.highestMark?.overall}
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
                            <TableCell className="w-[150px] text-center">
                              <div className="flex flex-col justify-evenly">
                                <Text className="size-lg text-center font-semibold">
                                  {subjectAnalytics?.lowestMark?.overall}
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
                        ))}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
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
