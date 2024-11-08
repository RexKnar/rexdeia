import { useGetExamAnalyticsStaffMasterQuery } from 'lib/queries/analytics/exam/useGetExamAnalyticsStaffMasterQuery';
import { Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

export default function StaffAnalysisTable({
  classId,
  examId,
}: {
  classId: string;
  sectionId?: string;
  examId: string;
}) {
  const { data: analyticsList } = useGetExamAnalyticsStaffMasterQuery(
    {
      examId,
      classId,
    },
    { enabled: !!examId && !!classId }
  );
  return (
    <section>
      {analyticsList && (
        <div className="mt-4 w-full space-y-4 overflow-auto rounded-md bg-white p-6 print:m-0 print:p-0">
          <Table className="overflow-scroll ">
            <TableHeader className=" bg-primary-300">
              <TableRow className="text-center">
                <TableCell className="w-[100px] text-center"></TableCell>
                <TableCell></TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="size-lg font-semibold">Total Students</Text>
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="size-lg font-semibold">Pending Entry</Text>
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
                  <Text className="size-lg font-semibold">No. of Failures</Text>
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
              {analyticsList.map((detailedAnalytics) => {
                const { analytics: staffAnalytics } = detailedAnalytics;
                let staffOverall = {
                  numberOfPassStudents: { male: 0, female: 0, overall: 0 },
                  numberOfFailStudents: { male: 0, female: 0, overall: 0 },
                  highestMark: { male: 0, female: 0, overall: 0 },
                  highestMarkStudentName: { male: '', female: '', overall: '' },
                  lowestMark: {
                    male: Infinity,
                    female: Infinity,
                    overall: Infinity,
                  },
                  lowestMarkStudentName: { male: '', female: '', overall: '' },
                  averageMark: { male: 0, female: 0, overall: 0 },
                  passPercentage: { male: 0, female: 0, overall: 0 },
                  failPercentage: { male: 0, female: 0, overall: 0 },
                  attendance: { male: 0, female: 0, overall: 0 },
                  absent: { male: 0, female: 0, overall: 0 },
                  markEntry: { male: 0, female: 0, overall: 0 },
                  totalStudents: { male: 0, female: 0, overall: 0 },
                };
                return (
                  <>
                    {staffAnalytics.map((subjectAnalytics, index) => {
                      staffOverall['numberOfPassStudents'].male +=
                        subjectAnalytics?.numberOfPassStudents?.male || 0;
                      staffOverall['numberOfPassStudents'].female +=
                        subjectAnalytics?.numberOfPassStudents?.female || 0;
                      staffOverall['numberOfPassStudents'].overall +=
                        subjectAnalytics?.numberOfPassStudents?.overall || 0;
                      staffOverall['numberOfFailStudents'].male +=
                        subjectAnalytics?.numberOfFailStudents?.male || 0;
                      staffOverall['numberOfFailStudents'].female +=
                        subjectAnalytics?.numberOfFailStudents?.female || 0;
                      staffOverall['numberOfFailStudents'].overall +=
                        subjectAnalytics?.numberOfFailStudents?.overall || 0;
                      staffOverall['highestMark'].male =
                        staffOverall['highestMark'].male <
                        subjectAnalytics?.highestMark?.male
                          ? subjectAnalytics?.highestMark?.male
                          : staffOverall['highestMark'].male;
                      staffOverall['highestMark'].female =
                        staffOverall['highestMark'].female <
                        subjectAnalytics?.highestMark?.female
                          ? subjectAnalytics?.highestMark?.female
                          : staffOverall['highestMark'].female;
                      staffOverall['highestMark'].overall =
                        staffOverall['highestMark'].overall <
                        subjectAnalytics?.highestMark?.overall
                          ? subjectAnalytics?.highestMark?.overall
                          : staffOverall['highestMark'].overall;
                      staffOverall['lowestMark'].male =
                        staffOverall['lowestMark'].male >
                        subjectAnalytics?.lowestMark?.male
                          ? subjectAnalytics?.lowestMark?.male
                          : staffOverall['lowestMark'].male;
                      staffOverall['lowestMark'].female =
                        staffOverall['lowestMark'].female >
                        subjectAnalytics?.lowestMark?.female
                          ? subjectAnalytics?.lowestMark?.female
                          : staffOverall['lowestMark'].female;
                      staffOverall['lowestMark'].overall =
                        staffOverall['lowestMark'].overall >
                        subjectAnalytics?.lowestMark?.overall
                          ? subjectAnalytics?.lowestMark?.overall
                          : staffOverall['lowestMark'].overall;
                      staffOverall['averageMark'].male +=
                        subjectAnalytics?.averageMark?.male || 0;
                      staffOverall['averageMark'].female +=
                        subjectAnalytics?.averageMark?.female || 0;
                      staffOverall['averageMark'].overall +=
                        subjectAnalytics?.averageMark?.overall || 0;
                      staffOverall['passPercentage'].male +=
                        subjectAnalytics?.passPercentage?.male || 0;
                      staffOverall['passPercentage'].female +=
                        subjectAnalytics?.passPercentage?.female || 0;
                      staffOverall['passPercentage'].overall +=
                        subjectAnalytics?.passPercentage?.overall || 0;
                      staffOverall['failPercentage'].male +=
                        subjectAnalytics?.failPercentage?.male || 0;
                      staffOverall['failPercentage'].female +=
                        subjectAnalytics?.failPercentage?.female || 0;
                      staffOverall['failPercentage'].overall +=
                        subjectAnalytics?.failPercentage?.overall || 0;
                      staffOverall['attendance'].male +=
                        subjectAnalytics?.attendance?.male || 0;
                      staffOverall['attendance'].female +=
                        subjectAnalytics?.attendance?.female || 0;
                      staffOverall['attendance'].overall +=
                        subjectAnalytics?.attendance?.overall || 0;
                      staffOverall['absent'].male +=
                        subjectAnalytics?.absent?.male || 0;
                      staffOverall['absent'].female +=
                        subjectAnalytics?.absent?.female || 0;
                      staffOverall['absent'].overall +=
                        subjectAnalytics?.absent?.overall || 0;
                      staffOverall['totalStudents'].male +=
                        subjectAnalytics?.totalStudents?.male || 0;
                      staffOverall['totalStudents'].female +=
                        subjectAnalytics?.totalStudents?.female || 0;
                      staffOverall['totalStudents'].overall +=
                        subjectAnalytics?.totalStudents?.overall || 0;
                      staffOverall['markEntry'].male +=
                        subjectAnalytics?.markEntry?.male || 0;
                      staffOverall['markEntry'].female +=
                        subjectAnalytics?.markEntry?.female || 0;
                      staffOverall['markEntry'].overall +=
                        subjectAnalytics?.markEntry?.overall || 0;

                      return (
                        <TableRow key={subjectAnalytics.id}>
                          {index === 0 && (
                            <TableCell
                              className="sticky w-[100px] bg-primary-300"
                              rowSpan={staffAnalytics.length + 1}
                            >
                              <Text className="size-lg font-semibold">
                                {detailedAnalytics.firstName +
                                  ' ' +
                                  detailedAnalytics.lastName ||
                                  '' + ' ' + detailedAnalytics.lastName ||
                                  ''}
                              </Text>
                            </TableCell>
                          )}
                          <TableCell className="w-[50px] bg-amber-300 text-center">
                            <div className="flex flex-col justify-evenly">
                              <Text className="size-lg text-center font-semibold">
                                {subjectAnalytics?.section.name}
                              </Text>
                              <Text className="size-lg text-center font-semibold">
                                {subjectAnalytics?.subject.name}
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
                                  {subjectAnalytics?.numberOfPassStudents.male}
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
                                  {subjectAnalytics?.numberOfFailStudents.male}
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
                      );
                    })}
                    <TableRow className="bg-green-300">
                      <TableCell className="w-[50px] text-center">
                        <div className="flex flex-col justify-evenly">
                          <Text className="size-lg text-center font-semibold">
                            Overall
                          </Text>
                        </div>
                      </TableCell>
                      <TableCell className="w-[150px] text-center">
                        <div className="flex flex-col justify-evenly">
                          <Text className="size-lg text-center font-semibold">
                            {staffOverall?.totalStudents?.overall}
                          </Text>
                          <div className="flex justify-evenly">
                            <Text className="text-primary-800">
                              M: {staffOverall?.totalStudents.male}
                            </Text>
                            <Text className="text-primary-800">
                              F: {staffOverall?.totalStudents.female}
                            </Text>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[150px] text-center">
                        <div className="flex flex-col justify-evenly">
                          <Text className="size-lg text-center font-semibold">
                            {staffOverall?.markEntry?.overall}
                          </Text>
                          <div className="flex justify-evenly">
                            <Text className="text-primary-800">
                              M: {staffOverall?.markEntry.male}
                            </Text>
                            <Text className="text-primary-800">
                              F: {staffOverall?.markEntry.female}
                            </Text>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[150px] text-center">
                        <div className="flex flex-col justify-evenly">
                          <Text className="size-lg text-center font-semibold">
                            {staffOverall?.attendance?.overall}
                          </Text>
                          <div className="flex justify-evenly">
                            <Text className="text-primary-800">
                              M: {staffOverall?.attendance.male}
                            </Text>
                            <Text className="text-primary-800">
                              F: {staffOverall?.attendance.female}
                            </Text>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[150px] text-center">
                        <div className="flex flex-col justify-evenly">
                          <Text className="size-lg text-center font-semibold">
                            {staffOverall?.absent?.overall}
                          </Text>
                          <div className="flex justify-evenly">
                            <Text className="text-primary-800">
                              M: {staffOverall?.absent.male}
                            </Text>
                            <Text className="text-primary-800">
                              F: {staffOverall?.absent.female}
                            </Text>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[150px] text-center">
                        <div className="flex flex-col justify-evenly">
                          <Text className="size-lg text-center font-semibold">
                            {staffOverall?.averageMark?.overall.toFixed(2)}
                          </Text>
                          <div className="flex justify-evenly">
                            <Text className="text-primary-800">
                              M: {staffOverall?.averageMark.male.toFixed(2)}
                            </Text>
                            <Text className="text-primary-800">
                              F: {staffOverall?.averageMark.female.toFixed(2)}
                            </Text>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[150px] text-center">
                        <div className="flex flex-col justify-evenly">
                          <Text className="size-lg text-center font-semibold">
                            {staffOverall?.numberOfPassStudents?.overall}
                          </Text>
                          <div className="flex justify-evenly">
                            <Text className="text-primary-800">
                              M: {staffOverall?.numberOfPassStudents.male}
                            </Text>
                            <Text className="text-primary-800">
                              F: {staffOverall?.numberOfPassStudents.female}
                            </Text>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[150px] text-center">
                        <div className="flex flex-col justify-evenly">
                          <Text className="size-lg text-center font-semibold">
                            {staffOverall?.numberOfFailStudents?.overall}
                          </Text>
                          <div className="flex justify-evenly">
                            <Text className="text-primary-800">
                              M: {staffOverall?.numberOfFailStudents.male}
                            </Text>
                            <Text className="text-primary-800">
                              F: {staffOverall?.numberOfFailStudents.female}
                            </Text>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[150px] text-center">
                        <div className="flex flex-col justify-evenly">
                          <Text className="size-lg text-center font-semibold">
                            {(
                              staffOverall?.passPercentage?.overall /
                              staffAnalytics.length
                            ).toFixed(2)}
                            %
                          </Text>
                          <div className="flex justify-evenly">
                            <Text className="text-primary-800">
                              M:{' '}
                              {(
                                staffOverall?.passPercentage.male /
                                staffAnalytics.length
                              ).toFixed(2)}
                              %
                            </Text>
                            <Text className="text-primary-800">
                              F:{' '}
                              {(
                                staffOverall?.passPercentage.female /
                                staffAnalytics.length
                              ).toFixed(2)}
                            </Text>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[150px] text-center">
                        <div className="flex flex-col justify-evenly">
                          <Text className="size-lg text-center font-semibold">
                            {(
                              staffOverall?.failPercentage?.overall /
                              staffAnalytics.length
                            ).toFixed(2)}
                            %
                          </Text>
                          <div className="flex justify-evenly">
                            <Text className="text-primary-800">
                              M:{' '}
                              {(
                                staffOverall?.failPercentage.male /
                                staffAnalytics.length
                              ).toFixed(2)}
                              %
                            </Text>
                            <Text className="text-primary-800">
                              F:{' '}
                              {(
                                staffOverall?.failPercentage.female /
                                staffAnalytics.length
                              ).toFixed(2)}
                              %
                            </Text>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[150px] text-center">
                        <div className="flex flex-col justify-evenly">
                          <Text className="size-lg text-center font-semibold">
                            {staffOverall?.highestMark?.overall}
                          </Text>
                          <div className="flex justify-evenly">
                            <Text className="text-primary-800">
                              M: {staffOverall?.highestMark.male}
                            </Text>
                            <Text className="text-primary-800">
                              F: {staffOverall?.highestMark.female}
                            </Text>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[150px] text-center">
                        <div className="flex flex-col justify-evenly">
                          <Text className="size-lg text-center font-semibold">
                            {staffOverall?.lowestMark?.overall}
                          </Text>
                          <div className="flex justify-evenly">
                            <Text className="text-primary-800">
                              M: {staffOverall?.lowestMark.male}
                            </Text>
                            <Text className="text-primary-800">
                              F: {staffOverall?.lowestMark.female}
                            </Text>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
