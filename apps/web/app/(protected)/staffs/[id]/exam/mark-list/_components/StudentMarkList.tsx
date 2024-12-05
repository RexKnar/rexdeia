import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingFn,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import PdfDocument from 'app/(protected)/analytics/pdf/_components/PdfDocument';
import { downloadMarkListXLSX } from 'app/(protected)/analytics/XLSX/excelExports';
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

export default function StudentMarkList({
  students,

  examDetails,
  sectionDetails,
  classDetails,
  subjectList,
}: {
  students: any[];

  examDetails: any;
  sectionDetails: any;
  classDetails: any;
  subjectList: any[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pdfTableHeader, setPdfTableHeader] = useState([]);
  const [pdfTableValues, setPdfTableValues] = useState([]);
  const [xlsxTableHeader, setXlsxTableHeader] = useState([]);

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
          accessorKey: `subject_${subject.id}`,
          header: () => (
            <div className="w-full">
              <div className="text-center">
                <Text className="size-lg font-semibold print:text-sm">
                  {subject.name}
                </Text>
              </div>
            </div>
          ),
          cell: ({ row }) => {
            const studentDetail = getStudentSubject(row.original, subject.id);
            return (
              <div className="w-full">
                <div className="flex justify-evenly">
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
            const detailA = getStudentSubject(rowA.original, subject.id);
            const detailB = getStudentSubject(rowB.original, subject.id);
            return (
              (detailA?.subjectTotalMark || 0) -
              (detailB?.subjectTotalMark || 0)
            );
          },
        });
      });
    }

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
        subjectName: subject.name,
        subTitle: [],
      }));
      let excelHeading = ['', '', ''];
      let excelSubHeading = ['#', 'Student Name', 'Section'];
      subjectList?.forEach((subject) => {
        excelHeading.push(subject.name);
      });

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
                  subject?.id
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
              })
            );
            const finalTotal = totalMark | 0;
            const finalStatus = failingStatus ? 'F' : 'P';
            tableValues.push(`${finalTotal}(${finalStatus})`);

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
