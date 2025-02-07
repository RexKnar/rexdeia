import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Text,
} from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

export function OverallStudentListDialog({
  studentList,
  title,
  subTitle,
  subjectList,
}: {
  studentList: any[];
  title: string;
  subTitle: string;
  subjectList: any[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get('isListDialogOpen') === 'true';
  const [sorting, setSorting] = useState<SortingState>([]);
  // const [pdfTableHeader, setPdfTableHeader] = useState([]);
  // const [pdfTableValues, setPdfTableValues] = useState([]);
  // const [xlsxTableHeader, setXlsxTableHeader] = useState([]);

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.delete('isListDialogOpen');

    router.replace(pathname + '?' + params.toString());
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      closeFlyout();
    }
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
    data: studentList,
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
      // let heading = subjectList?.map((subject) => ({
      //   subjectName: subject.subject.name,
      //   subTitle: [
      //     ...subject.examSubjectPartition.map(
      //       (partition) => partition.assessmentFormat.name
      //     ),
      //     'Tot',
      //   ],
      // }));
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
    }
  }, [subjectList]);

  useEffect(() => {
    const processStudents = async () => {
      if (studentList?.length !== 0) {
        // const finalTableValues = await Promise.all(
        //   studentList.map(async (student, index) => {
        //     const tableValues = [];
        //     const indexValue = index + 1;
        //     tableValues.push(indexValue.toString());
        //     tableValues.push(`${student?.firstName} ${student?.lastName}`);
        //     tableValues.push(student.section?.name);
        //     let totalMark = 0;
        //     let failingStatus = false;
        //     await Promise.all(
        //       subjectList.map(async (subject) => {
        //         const studentDetail = await getStudentSubject(
        //           student,
        //           subject?.subject?.id
        //         );
        //         if (studentDetail?.marks?.length > 0) {
        //           subject.examSubjectPartition.forEach(
        //             (examSubjectPartition) => {
        //               const mark =
        //                 studentDetail.marks.find(
        //                   (obj) =>
        //                     obj.examSubjectPartitionId ===
        //                     examSubjectPartition.id
        //                 ) || null;
        //               if (mark) {
        //                 if (mark?.attandance) {
        //                   tableValues.push('A');
        //                 } else {
        //                   const markTotal = Number(mark.total) || 0;
        //                   tableValues.push(markTotal.toString());
        //                   totalMark += markTotal;
        //                 }
        //               } else {
        //                 tableValues.push('-');
        //               }
        //             }
        //           );
        //           if (!studentDetail.absentStatus) {
        //             const subjectTotal =
        //               Number(studentDetail?.subjectTotalMark) || 0;
        //             if (studentDetail?.failingStatus) {
        //               tableValues.push(`${subjectTotal}(F)`);
        //               failingStatus = true;
        //             } else {
        //               tableValues.push(`${subjectTotal}(P)`);
        //             }
        //           } else {
        //             tableValues.push('A');
        //           }
        //         } else {
        //           subject.examSubjectPartition.forEach(
        //             // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //             () => {
        //               tableValues.push('-');
        //             }
        //           );
        //           tableValues.push('-');
        //         }
        //       })
        //     );
        //     const finalTotal = totalMark | 0;
        //     const finalStatus = failingStatus ? 'F' : 'P';
        //     tableValues.push(`${finalTotal}(${finalStatus})`);
        //     tableValues.push(student.rank.toString());
        //     return tableValues;
        //   })
        // );
        // setPdfTableValues(finalTableValues);
      }
    };

    processStudents();
  }, [getStudentSubject, studentList, subjectList]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title} ({subTitle})
          </DialogTitle>
          <DialogDescription>
            <section className="max-h-[80vh] overflow-y-auto">
              <section>
                {subjectList && (
                  <div className="mt-4 space-y-4 overflow-x-auto rounded-md bg-white p-6 print:m-0 print:p-0">
                    <div className="w-full">
                      {/* {pdfTableHeader?.length > 0 && (
                        // <PdfDocument
                        //   headingList={pdfTableHeader as any}
                        //   tableValues={pdfTableValues}
                        //   examDetails={examDetails}
                        //   classDetails={classDetails}
                        //   sectionDetails={sectionDetails}
                        // />
                      )} */}
                      {/* <Button
                        variant="outline"
                        onClick={() =>
                          // downloadMarkListXLSX(
                          //   xlsxTableHeader,
                          //   pdfTableHeader,
                          //   pdfTableValues,
                          //   examDetails,
                          //   classDetails,
                          //   sectionDetails
                          // )
                        }
                      >
                        Download XLSX <TableIcon className="w-4 h-4 ml-2" />
                      </Button> */}
                    </div>
                    <Table className="border-1 border">
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow
                            key={headerGroup.id}
                            className="bg-primary-300"
                          >
                            {headerGroup.headers.map((header, index) => (
                              <TableCell
                                key={header.id}
                                className={`
                          ${index === 0 ? 'sticky left-0 z-10 bg-primary-300' : ''}
                          ${index === 1 ? 'sticky left-16 z-10 bg-primary-300' : ''}
                          whitespace-nowrap p-4 text-sm
                        `}
                              >
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
                            {row.getVisibleCells().map((cell, index) => (
                              <TableCell
                                key={cell.id}
                                className={`
                          ${index === 0 ? 'sticky left-0 z-10 bg-white' : ''}
                          ${index === 1 ? 'sticky left-16 z-10 bg-white' : ''}
                          whitespace-nowrap p-4 text-sm
                        `}
                              >
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
            </section>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
