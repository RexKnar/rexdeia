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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button, Input, Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

import dataSegmentationGif from '../../../../public/assets/images/data-segmentation.gif';
import { OverallStudentListDialog } from '../_modals/OverallStudentListDialog';
import PdfDocument from '../pdf/_components/PdfDocument';
import { downloadMarkListXLSX } from '../XLSX/excelExports';
import { DataLoadingPlaceholder } from './DataLoadingPlaceholder';

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
  const [modalStudentList, setModalStudentList] = useState([]);
  const [modalTitle, setModalTitle] = useState('Student List');
  const [modalSubTitle, setModalSubTitle] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const { data: subjectList, isLoading: isSubjectListLoading } =
    useGetExamSubjectsByClassSectionIdQuery(
      sectionId ? { examId, classId, sectionId } : { examId, classId },
      { enabled: !!examId && !!classId }
    );

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
                            {studentDetail.subjectTotalMark || 0}(
                            {studentDetail.grade})
                          </span>
                        ) : (
                          <span className="text-green-500 print:p-0 print:text-sm">
                            {studentDetail.subjectTotalMark || 0}(
                            {studentDetail.grade})
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
            {row.original.rank || ''} ({row.original.grade || '-'})
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
            // let failingStatus = false;

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
                            obj.assessmentFormatId ===
                            examSubjectPartition.assessmentFormatId
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

                  if (!studentDetail?.absentStatus) {
                    const subjectTotal =
                      Number(studentDetail?.subjectTotalMark) || 0;
                    if (studentDetail?.failingStatus) {
                      tableValues.push(
                        `${subjectTotal}(${studentDetail.grade})`
                      );
                      // failingStatus = true;
                    } else {
                      tableValues.push(
                        `${subjectTotal}(${studentDetail.grade})`
                      );
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
            // const finalStatus = failingStatus ? 'F' : 'P';
            tableValues.push(`${finalTotal}(${student.grade})`);

            tableValues.push(student.rank.toString());

            return tableValues;
          })
        );

        setPdfTableValues(finalTableValues);
      }
    };

    processStudents();
  }, [getStudentSubject, students, subjectList]);

  const [filteredTopStudentList, setFilteredTopStudentList] = useState([]);
  const [filteredBottomStudentList, setFilteredBottomStudentList] = useState(
    []
  );
  const filterValidRanks = (students) => {
    return students.filter((student) => {
      return (
        student.rank && student.rank >= 1 // rank should be greater than or equal to 1
      );
    });
  };
  const getTopNStudents = (n) => {
    const validStudents = filterValidRanks([...students]);
    const sortedStudents = validStudents.sort((a, b) => a.rank - b.rank);
    return sortedStudents.slice(0, n);
  };

  const getBottomNStudents = (n) => {
    const validStudents = filterValidRanks([...students]);
    const sortedStudents = validStudents.sort((a, b) => a.rank - b.rank);
    const bottomStudents = sortedStudents.slice(-n);
    return bottomStudents.reverse();
  };

  const handleCountChange = (event) => {
    const count = parseInt(event.target.value) || 5;
    const topStudentList = getTopNStudents(count || 5);
    setFilteredTopStudentList(topStudentList);
    const bottomStudentList = getBottomNStudents(count || 5);
    setFilteredBottomStudentList(bottomStudentList);
  };

  const showTopStudentsList = () => {
    setModalStudentList(filteredTopStudentList);
    setModalTitle('Top Students');
    setModalSubTitle('Top students based on Rank');
    params.set('isListDialogOpen', 'true');

    router.replace(pathname + '?' + params.toString());
  };
  const showBottomStudentsList = () => {
    setModalStudentList(filteredBottomStudentList);
    setModalTitle('Bottom Students');
    setModalSubTitle('Bottom students based on Rank');
    params.set('isListDialogOpen', 'true');

    router.replace(pathname + '?' + params.toString());
  };
  return (
    <section className="space-y-2 rounded-md bg-white p-6">
      {!isSubjectListLoading ? (
        <section>
          {subjectList && (
            <div className="mt-4 space-y-4 overflow-x-auto rounded-md bg-white p-6 print:m-0 print:p-0">
              <div className="w-full">
                <div className="flex gap-3">
                  <div>
                    <Input
                      type="number"
                      placeholder="Enter number of students"
                      onKeyUp={handleCountChange}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={showTopStudentsList}>
                      Show top students
                    </Button>
                    <Button onClick={showBottomStudentsList}>
                      Show bottom students
                    </Button>
                  </div>
                  <div className="flex gap-3">
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
                </div>
              </div>
              {/* <div className="relative ">
                <div className="relative h-[50vh]">
                  <Table className="border-1 ">
                    <TableHeader className="sticky top-0 z-20 bg-primary-300">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                          key={headerGroup.id}
                          className=" bg-primary-300"
                        >
                          {headerGroup.headers.map((header, index) => (
                            <TableCell
                              key={header.id}
                              className={`
            ${index === 0 ? 'sticky left-0 z-30 bg-primary-300 ' : ''}
            ${index === 1 ? 'sticky left-16 z-30 bg-primary-300 ' : ''}
            p-4 text-sm
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
            ${index === 0 ? 'sticky left-0  z-10 bg-white ' : ''}
            ${index === 1 ? 'sticky left-16 z-10 bg-white ' : ''}
            p-4 text-sm
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
              </div> */}

              <div className="relative rounded-md border">
                <div className="overflow-auto ">
                  <div className="inline-block w-full align-middle">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                              key={headerGroup.id}
                              className="sticky top-0 bg-primary-300 shadow-sm"
                            >
                              {headerGroup.headers.map((header, index) => (
                                <TableCell
                                  key={header.id}
                                  className={`
                          ${index === 0 ? 'sticky left-0 z-30 bg-primary-300' : ''}
                          ${index === 1 ? 'sticky left-16 z-30 bg-primary-300' : ''}
                          whitespace-nowrap p-4 text-sm font-medium
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
                  </div>
                </div>
              </div>
            </div>
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
        subjectList={subjectList}
      />
    </section>
  );
}
