import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingFn,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useGetExamSubjectsByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectsByClassSectionIdQuery';
import { ArrowUpDown, TableIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button, Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

import PdfDocument from '../pdf/_components/PdfDocument';
import { downloadMarkListXLSX } from '../XLSX/excelExports';

export default function StudentMarkList({
  students,
  classId,
  examId,
  sectionId,
  examDetails,
  sectionDetails,
  classDetails,
}: {
  students: any[];
  classId: string;
  sectionId?: string;
  examId: string;
  examDetails: any;
  sectionDetails: any;
  classDetails: any;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pdfTableHeader, setPdfTableHeader] = useState([]);
  const [pdfTableValues, setPdfTableValues] = useState([]);
  const [xlsxTableHeader, setXlsxTableHeader] = useState([]);

  const { data: subjectList } = useGetExamSubjectsByClassSectionIdQuery(
    sectionId ? { examId, classId, sectionId } : { examId, classId },
    { enabled: !!examId && !!classId }
  );

  // const { data: subjectMasterList } =
  //   useGetExamSubjectMasterByClassSectionIdQuery(
  //     sectionId ? { examId, classId, sectionId } : { examId, classId },
  //     { enabled: !!examId && !!classId }
  //   );

  const customStudentSort: SortingFn<any> = (rowA, rowB) => {
    const genderOrder = { Female: 0, Male: 1 };
    const genderCompare =
      genderOrder[rowA.original.gender] - genderOrder[rowB.original.gender];

    if (genderCompare === 0) {
      const nameA =
        `${rowA.original.firstName} ${rowA.original.lastName}`.toLowerCase();
      const nameB =
        `${rowB.original.firstName} ${rowB.original.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    }

    return genderCompare;
  };
  const getStudentSubject = useCallback((student, subjectId) => {
    return student.subjects.find((subject) => subject.id === subjectId);
  }, []);

  const createColumns = useCallback(() => {
    const baseColumns: ColumnDef<any>[] = [
      {
        accessorKey: 'index',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="w-full"
            >
              #
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-center">{Number(row.index) + 1}</div>
        ),
      },

      {
        id: 'fullName',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        sortingFn: customStudentSort,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="w-full"
            >
              Student Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {`${row.original.firstName} ${row.original.lastName}`}
            <span className="text-muted-foreground text-xs">
              ({row.original.section.name})
            </span>
          </div>
        ),
      },
    ];

    if (subjectList) {
      subjectList.forEach((subject) => {
        baseColumns.push({
          accessorKey: `subject_${subject.subject.id}`,
          header: () => (
            <div className="w-full">
              <div className="text-center">
                <Text className="size-lg font-semibold print:text-sm">
                  {subject.subject.name}
                </Text>
              </div>
              <div className="flex justify-evenly">
                {subject.examSubjectPartition.map((partition) => (
                  <span
                    key={partition.id}
                    className="size-lg font-semibold print:text-sm"
                  >
                    {partition.assessmentFormat.name}
                  </span>
                ))}
                <span>Tot</span>
              </div>
            </div>
          ),
          cell: ({ row }) => {
            const studentDetail = getStudentSubject(
              row.original,
              subject.subject.id
            );
            return (
              <div className="w-full">
                <div className="flex justify-evenly">
                  {studentDetail?.marks.map((mark) =>
                    mark.attandance ? (
                      <span
                        key={mark.id}
                        className="text-bold text-red-500 print:hidden"
                      >
                        A
                      </span>
                    ) : (
                      <span key={mark.id}>{mark.total}</span>
                    )
                  )}
                  {studentDetail?.marks?.length > 0 ? (
                    !studentDetail.absentStatus ? (
                      <b>
                        {studentDetail?.failingStatus ? (
                          <span className="text-red-500 print:p-0 print:text-sm">
                            {studentDetail.subjectTotalMark || 0}(F)
                          </span>
                        ) : (
                          <span className="text-green-500 print:p-0 print:text-sm">
                            {studentDetail.subjectTotalMark || 0}(P)
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
            );
          },
          sortingFn: (rowA, rowB) => {
            const detailA = getStudentSubject(
              rowA.original,
              subject.subject.id
            );
            const detailB = getStudentSubject(
              rowB.original,
              subject.subject.id
            );
            return (
              (detailA?.subjectTotalMark || 0) -
              (detailB?.subjectTotalMark || 0)
            );
          },
        });
      });
    }

    baseColumns.push(
      {
        accessorKey: 'totalMark',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="w-full"
          >
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            {row.original.failingStatus ? (
              <>
                <p className="text-red-500 print:p-0 print:text-sm">(F)</p>
                <p className="text-red-500 print:p-0 print:text-sm">
                  {row.original.totalMark}(
                  {row.original.totalPercentage?.toFixed(2)}%)
                </p>
              </>
            ) : (
              <>
                <p className="text-green-500 print:p-0 print:text-sm">(P)</p>
                <p className="text-green-500 print:p-0 print:text-sm">
                  {row.original.totalMark}(
                  {row.original.totalPercentage?.toFixed(2)}%)
                </p>
              </>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'rank',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="w-full"
          >
            Rank
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.rank || ''}
            <br />
            {!row.original.attendance && (
              <span className="text-red-500 print:p-0 print:text-sm">A</span>
            )}
            <br />
            Centum: {row.original.centumCount || '0'}
          </div>
        ),
      }
    );

    return baseColumns;
  }, [subjectList, getStudentSubject]);

  const columns = createColumns();

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

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
      let excelHeading = ['', '', ''];
      let excelSubHeading = ['#', 'Student Name', 'Section'];
      subjectList?.forEach((subject) => {
        excelHeading.push(subject.subject.name);
        subject.examSubjectPartition.forEach((partition) => {
          excelHeading.push(null);
          excelSubHeading.push(partition.assessmentFormat.name);
        });
        excelSubHeading.push('Tot');
      });
      excelHeading.push('Total');
      excelHeading.push('Rank');
      excelSubHeading.push('Total');
      excelSubHeading.push('Rank');

      setXlsxTableHeader([excelHeading, excelSubHeading]);

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
            tableValues.push(student.section?.name);

            let totalMark = 0;
            let failingStatus = false;

            await Promise.all(
              subjectList.map(async (subject) => {
                const studentDetail = await getStudentSubject(
                  student,
                  subject?.subject?.id
                );

                if (studentDetail?.marks?.length > 0) {
                  subject.examSubjectPartition.forEach(
                    (examSubjectPartition) => {
                      const mark =
                        studentDetail.marks.find(
                          (obj) =>
                            obj.examSubjectPartitionId ===
                            examSubjectPartition.id
                        ) || null;

                      if (mark) {
                        if (mark?.attandance) {
                          tableValues.push('A');
                        } else {
                          const markTotal = Number(mark.total) || 0;
                          tableValues.push(markTotal.toString());
                          totalMark += markTotal;
                        }
                      } else {
                        tableValues.push('-');
                      }
                    }
                  );

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
                  subject.examSubjectPartition.forEach(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    () => {
                      tableValues.push('-');
                    }
                  );
                  tableValues.push('-');
                }
              })
            );
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
  }, [getStudentSubject, students, subjectList]);

  return (
    <section>
      {subjectList && (
        <div className="mt-4 space-y-4 overflow-x-auto rounded-md bg-white p-6 print:m-0 print:p-0">
          <div className="w-full">
            {pdfTableHeader?.length > 0 && (
              <PdfDocument
                headingList={pdfTableHeader as any}
                tableValues={pdfTableValues}
                examDetails={examDetails}
                classDetails={classDetails}
                sectionDetails={sectionDetails}
              />
            )}
            <Button
              variant="outline"
              onClick={() =>
                downloadMarkListXLSX(
                  xlsxTableHeader,
                  pdfTableHeader,
                  pdfTableValues,
                  examDetails,
                  classDetails,
                  sectionDetails
                )
              }
            >
              Download XLSX <TableIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <Table className="border-1 border">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-primary-300">
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
