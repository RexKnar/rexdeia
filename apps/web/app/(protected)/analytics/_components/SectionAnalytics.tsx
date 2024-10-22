import { useGetExamAnalyticsSectionMasterQuery } from 'lib/queries/analytics/exam/useGetSectionAnalyticsMasterQuery';
import { useEffect, useState } from 'react';
import { Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

import PdfDocument from '../pdf/_components/PdfDocument';

export default function SectionAnalytics({
  classId,
  examId,
}: {
  classId: string;
  examId: string;
}) {
  const { data: analyticsList } = useGetExamAnalyticsSectionMasterQuery(
    {
      examId,
      classId,
    },
    { enabled: !!examId && !!classId }
  );

  const [pdfTableHeader, setPdfTableHeader] = useState<any[]>([]);
  const [pdfTableValues, setPdfTableValues] = useState<any[]>([]);

  useEffect(() => {
    if (analyticsList?.length > 0) {
      const heading = [
        'Section',
        'Total Students',
        'Pending Entry',
        'Appeared',
        'Absent',
        'Average',
        'No. of Pass',
        'No. of Failures',
        'Pass %',
        'Failure %',
        'Highest',
        'Lowest',
      ];
      setPdfTableHeader(heading);
    }
  }, [analyticsList]);

 
  useEffect(() => {
    if (analyticsList?.length > 0) {
      const finalTableValues = analyticsList.map((subjectAnalytics) => {
        return subjectAnalytics.analytics.map((analyticsDetail) => {
          return [
            analyticsDetail?.section?.name,
            analyticsDetail?.totalStudents?.overall,
            analyticsDetail?.markEntry?.overall,
            analyticsDetail?.attendance?.overall,
            analyticsDetail?.absent?.overall,
            analyticsDetail?.averageMark?.overall?.toFixed(2),
            analyticsDetail?.numberOfPassStudents?.overall,
            analyticsDetail?.numberOfFailStudents?.overall,
            `${analyticsDetail?.passPercentage?.overall?.toFixed(2)}%`,
            `${analyticsDetail?.failPercentage?.overall?.toFixed(2)}%`,
            analyticsDetail?.highestMark?.overall,
            analyticsDetail?.lowestMark?.overall,
          ];
        });
      });
      setPdfTableValues(finalTableValues.flat());
    }
  }, [analyticsList]);

  const renderAnalyticsRow = (subjectAnalytics: any) => {
    return subjectAnalytics.analytics.map((analyticsDetail: any, index: number) => {
      return (
        <TableRow key={analyticsDetail.section.id}>
          {index === 0 && (
            <TableCell className="sticky w-[100px] bg-primary-300" rowSpan={subjectAnalytics.analytics.length}>
              <Text className="font-semibold size-lg">{subjectAnalytics.subject.name}</Text>
            </TableCell>
          )}
          <TableCell className="w-[150px] text-center">
            <Text className="font-semibold">{analyticsDetail?.section?.name}</Text>
          </TableCell>
          <TableCell className="w-[150px] text-center">
            {analyticsDetail?.totalStudents?.overall}
          </TableCell>
          <TableCell className="w-[150px] text-center">
            {analyticsDetail?.markEntry?.overall}
          </TableCell>
          <TableCell className="w-[150px] text-center">
            {analyticsDetail?.attendance?.overall}
          </TableCell>
          <TableCell className="w-[150px] text-center">
            {analyticsDetail?.absent?.overall}
          </TableCell>
          <TableCell className="w-[150px] text-center">
            {analyticsDetail?.averageMark?.overall?.toFixed(2)}
          </TableCell>
          <TableCell className="w-[150px] text-center">
            {analyticsDetail?.numberOfPassStudents?.overall}
          </TableCell>
          <TableCell className="w-[150px] text-center">
            {analyticsDetail?.numberOfFailStudents?.overall}
          </TableCell>
          <TableCell className="w-[150px] text-center">
            {`${analyticsDetail?.passPercentage?.overall?.toFixed(2)}%`}
          </TableCell>
          <TableCell className="w-[150px] text-center">
            {`${analyticsDetail?.failPercentage?.overall?.toFixed(2)}%`}
          </TableCell>
          <TableCell className="w-[150px] text-center">
            {analyticsDetail?.highestMark?.overall}
          </TableCell>
          <TableCell className="w-[150px] text-center">
            {analyticsDetail?.lowestMark?.overall}
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <section>
      {analyticsList && (
        <div className="w-full p-6 mt-4 space-y-4 overflow-auto bg-white rounded-md print:m-0 print:p-0">
          <div className="w-full">
            {pdfTableHeader.length > 0 && (
              <PdfDocument headingList={pdfTableHeader} tableValues={pdfTableValues} />
            )}
          </div>
          <Table className="overflow-scroll">
            <TableHeader className="bg-primary-300">
              <TableRow className="text-center">
                <TableCell className="w-[100px] text-center"></TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="font-semibold size-lg">Section</Text>
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="font-semibold size-lg">Total Students</Text>
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="font-semibold size-lg">Pending Entry</Text>
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="font-semibold size-lg">Appeared</Text>
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="font-semibold size-lg">Absent</Text>
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="font-semibold size-lg">Average</Text>
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="font-semibold size-lg">No. of Pass</Text>
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="font-semibold size-lg">No. of Failures</Text>
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="font-semibold size-lg">Pass %</Text>
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="font-semibold size-lg">Failure %</Text>
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="font-semibold size-lg">Highest</Text>
                </TableCell>
                <TableCell className="w-[150px] text-center">
                  <Text className="font-semibold size-lg">Lowest</Text>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>{analyticsList.map(renderAnalyticsRow)}</TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
