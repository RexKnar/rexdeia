import { useGetExamSubjectsByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectsByClassSectionIdQuery';
import { useCallback, useEffect, useState } from 'react';
import { Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

import PdfDocument from '../pdf/_components/PdfDocument';

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
  const { data: subjectList } = useGetExamSubjectsByClassSectionIdQuery(
    sectionId ? { examId, classId, sectionId } : { examId, classId },
    { enabled: !!examId && !!classId }
  );

  const [pdfTableHeader, setPdfTableHeader] = useState([]);
  const [pdfTableValues, setPdfTableValues] = useState([]);

  useEffect(() => {
    if (subjectList?.length > 0) {
      let heading = subjectList?.map((subject) => ({
        subjectName: subject.subject.name,
        subTitle: [
          ...subject.examSubjectPartition.map(
            (partition) => partition.assessmentFormat.name
          ),
          'Tot',
        ],
      }));

      heading?.length > 0
        ? setPdfTableHeader([...heading])
        : setPdfTableHeader([]);
    }
  }, [subjectList]);

  useEffect(() => {
    const processStudents = async () => {
      if (students?.length !== 0) {
        const finalTableValues = await Promise.all(
          students.map(async (student, index) => {
            const tableValues = [];
            const indexValue = index + 1;
            tableValues.push(indexValue.toString());
            tableValues.push(`${student?.firstName} ${student?.lastName}`);

            let totalMark = 0;
            let failingStatus = false;

            await Promise.all(
              student.subjects.map(async (subject) => {
                const studentDetail = await getStudentSubject(
                  student,
                  subject?.id
                );

                if (studentDetail?.marks?.length > 0) {
                  studentDetail.marks.forEach((mark) => {
                    if (mark?.attandance) {
                      tableValues.push('A');
                    } else {
                      const markTotal = Number(mark.total) || 0;
                      tableValues.push(markTotal.toString());
                      totalMark += markTotal;
                    }
                  });

                  if (!studentDetail.absentStatus) {
                    const subjectTotal =
                      Number(studentDetail?.subjectTotalMark) || 0;
                    if (studentDetail?.failingStatus) {
                      tableValues.push(`${subjectTotal}(F)`);
                      failingStatus = true;
                    } else {
                      tableValues.push(`${subjectTotal}(P)`);
                    }
                  } else {
                    tableValues.push('A');
                  }
                } else {
                  tableValues.push('-');
                }
              })
            );

            // Add the total mark and pass/fail status after processing all subjects
            const finalTotal = totalMark | 0;
            const finalStatus = failingStatus ? 'F' : 'P';
            tableValues.push(`${finalTotal}(${finalStatus})`);

            tableValues.push(student.rank.toString());
            return tableValues;
          })
        );

        setPdfTableValues(finalTableValues);
      }
    };

    processStudents();
  }, [students]);

  const getStudentSubject = useCallback((student, subjectId) => {
    return student.subjects.find((subject) => subject.id === subjectId);
  }, []);

  const renderStudentRow = (student, index) => {
    return (
      <TableRow key={student.id}>
        <TableCell className="text-center print:p-0">{index + 1}</TableCell>
        <TableCell className="sticky print:p-0">
          {student.firstName} {student.lastName}
        </TableCell>
        {subjectList.map((subject) => {
          const studentDetail = getStudentSubject(student, subject.subject.id);

          return (
            <TableCell key={subject.subjectId} className="w:1/3 print:p-0">
              <div className="w-full">
                <div className="flex justify-evenly ">
                  {studentDetail?.marks.map((mark) => {
                    if (mark.attandance) {
                      return (
                        <span
                          key={mark.id}
                          className="text-bold text-red-500 print:hidden"
                        >
                          A
                        </span>
                      );
                    } else {
                      return <span key={mark.id}>{mark.total}</span>;
                    }
                  })}

                  {studentDetail?.marks?.length > 0 ? (
                    !studentDetail.absentStatus ? (
                      <b>
                        {studentDetail?.failingStatus ? (
                          <span className="text-red-500 print:p-0 print:text-sm">
                            {studentDetail.subjectTotalMark || 0}
                            (F)
                          </span>
                        ) : (
                          <span className="text-green-500 print:p-0 print:text-sm">
                            {studentDetail?.subjectTotalMark || 0}
                            (P)
                          </span>
                        )}
                      </b>
                    ) : (
                      <span className="text-red-500 print:p-0 print:text-sm">
                        A
                      </span>
                    )
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </TableCell>
          );
        })}
        <TableCell>
          {student.failingStatus ? (
            <>
              <p className="text-red-500 print:p-0 print:text-sm">(F)</p>
              <p className="text-red-500 print:p-0 print:text-sm">
                {student.totalMark}({student.totalPercentage?.toFixed(2)}%)
              </p>
            </>
          ) : (
            <>
              <p className="text-green-500 print:p-0 print:text-sm">(P)</p>
              <p className="text-green-500 print:p-0 print:text-sm">
                {student.totalMark}({student.totalPercentage?.toFixed(2)}%)
              </p>
            </>
          )}
        </TableCell>
        <TableCell className="text-center print:p-0">
          {student.rank || '-'}
          <br />
          {!student.attendance && (
            <span className="text-red-500 print:p-0 print:text-sm">A</span>
          )}
          <br />
          Centum: {student.centumCount || '0'}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <section>
      {subjectList && (
        <div className="mt-4 space-y-4 overflow-x-auto rounded-md bg-white p-6 print:m-0 print:p-0 ">
          <div className="w-full">
            {pdfTableHeader?.length > 0 && (
              <PdfDocument
                headingList={pdfTableHeader as any}
                tableValues={pdfTableValues}
              />
            )}
          </div>
          <Table className="border-1 border">
            <TableHeader>
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
                {subjectList.map((subject) => {
                  const subjectTitles = (
                    <TableCell key={subject.subject.id}>
                      <div className="w-full ">
                        <div className="text-center">
                          <Text className="size-lg font-semibold print:text-sm">
                            {subject.subject.name}
                          </Text>
                        </div>
                        <div className="flex justify-evenly ">
                          {subject.examSubjectPartition.map((partition) => {
                            const partitionTitles = (
                              <span
                                className="size-lg font-semibold print:text-sm"
                                key={partition.id}
                              >
                                {partition.assessmentFormat.name}
                              </span>
                            );
                            return partitionTitles;
                          })}

                          <span>Tot</span>
                        </div>
                      </div>
                    </TableCell>
                  );

                  return subjectTitles;
                })}
                <TableCell>
                  <Text className="text-xs font-semibold">Total </Text>
                </TableCell>
                <TableCell>Rank</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>{students.map(renderStudentRow)}</TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
