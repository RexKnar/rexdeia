'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Button, Slider, Switch, Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

import noDataFoundSvg from '../../../../public/assets/images/analytics-empty-state_Artboard_1.svg';
import { OverallStudentListDialog } from '../_modals/OverallStudentListDialog';
import { DataLoadingPlaceholder } from './DataLoadingPlaceholder';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CustomRangeColumn {
  id: string;
  label: string;
  range: [number, number]; // [min, max]
}

interface Props {
  subjectList: any[];
  markList: any[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function CustomRangeAnalyticsTable({
  subjectList,
  markList,
}: Props) {
  const [rangeMode, setRangeMode] = useState<'SubjectMarks' | 'TotalMarks'>(
    'SubjectMarks',
  );

  const [columns, setColumns] = useState<CustomRangeColumn[]>([
    { id: uid(), label: 'Below 35', range: [0, 35] },
    { id: uid(), label: '35 – 60', range: [35, 60] },
    { id: uid(), label: '60 – 80', range: [60, 80] },
    { id: uid(), label: '80 – 100', range: [80, 100] },
  ]);

  const [modalStudentList, setModalStudentList] = useState<any[]>([]);
  const [modalSubjectList, setModalSubjectList] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSubTitle, setModalSubTitle] = useState('');

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Column management ────────────────────────────────────────────────────

  const addColumn = useCallback(() => {
    setColumns((prev) => [
      ...prev,
      { id: uid(), label: `Range ${prev.length + 1}`, range: [0, 100] },
    ]);
  }, []);

  const removeColumn = useCallback((id: string) => {
    setColumns((prev) => prev.filter((col) => col.id !== id));
  }, []);

  const updateColumnLabel = useCallback((id: string, label: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, label } : col)),
    );
  }, []);

  const updateColumnRange = useCallback((id: string, range: [number, number]) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, range } : col)),
    );
  }, []);

  // ── Calculation helpers ──────────────────────────────────────────────────

  function calcSubjectRange(
    { range }: CustomRangeColumn,
    subjectId: string,
  ) {
    const [startValue, endValue] = range;
    let maleCount = 0;
    let femaleCount = 0;
    let totalCount = 0;
    let overallTotalCount = 0;
    const students: any[] = [];
    const maleStudents: any[] = [];
    const femaleStudents: any[] = [];

    markList.forEach((student) => {
      student.subjects?.forEach((subject: any) => {
        if (!subject.absentStatus && subject.id === subjectId) {
          overallTotalCount++;
          const mark = parseFloat(subject.subjectTotalMark);
          if (mark >= startValue && mark <= endValue) {
            students.push(student);
            totalCount++;
            if (student.gender?.toLowerCase() === 'female') {
              femaleCount++;
              femaleStudents.push(student);
            } else if (student.gender?.toLowerCase() === 'male') {
              maleCount++;
              maleStudents.push(student);
            }
          }
        }
      });
    });

    return {
      totalCount,
      maleCount,
      femaleCount,
      students,
      maleStudents,
      femaleStudents,
      overallPercentage: overallTotalCount
        ? (totalCount / overallTotalCount) * 100
        : 0,
      malePercentage: overallTotalCount
        ? (maleCount / overallTotalCount) * 100
        : 0,
      femalePercentage: overallTotalCount
        ? (femaleCount / overallTotalCount) * 100
        : 0,
    };
  }

  function calcTotalRange({ range }: CustomRangeColumn) {
    const [startValue, endValue] = range;
    let maleCount = 0;
    let femaleCount = 0;
    let totalCount = 0;
    let overallTotalCount = 0;
    const students: any[] = [];
    const maleStudents: any[] = [];
    const femaleStudents: any[] = [];

    markList.forEach((student) => {
      if (!student.overallAbsentStatus) {
        overallTotalCount++;
        const mark = parseFloat(student.totalMark);
        if (mark >= startValue && mark <= endValue) {
          students.push(student);
          totalCount++;
          if (student.gender?.toLowerCase() === 'female') {
            femaleCount++;
            femaleStudents.push(student);
          } else if (student.gender?.toLowerCase() === 'male') {
            maleCount++;
            maleStudents.push(student);
          }
        }
      }
    });

    return {
      totalCount,
      maleCount,
      femaleCount,
      students,
      maleStudents,
      femaleStudents,
      overallPercentage: overallTotalCount
        ? (totalCount / overallTotalCount) * 100
        : 0,
      malePercentage: overallTotalCount
        ? (maleCount / overallTotalCount) * 100
        : 0,
      femalePercentage: overallTotalCount
        ? (femaleCount / overallTotalCount) * 100
        : 0,
    };
  }

  // ── Dialog helpers ───────────────────────────────────────────────────────

  function openDialog(
    students: any[],
    title: string,
    subTitle: string,
    subjectList?: any[],
  ) {
    const sorted = [...students].sort((a, b) => {
      if (subjectList?.length) {
        const sid = subjectList[0].subject.id;
        const markA = a.subjects?.find((s: any) => s.id === sid)?.subjectTotalMark ?? 0;
        const markB = b.subjects?.find((s: any) => s.id === sid)?.subjectTotalMark ?? 0;
        return parseFloat(markB) - parseFloat(markA);
      }
      return parseFloat(b.totalMark) - parseFloat(a.totalMark);
    });

    setModalStudentList(sorted);
    setModalTitle(title);
    setModalSubTitle(subTitle);
    setModalSubjectList(subjectList ?? []);

    const params = new URLSearchParams(searchParams.toString());
    params.set('isListDialogOpen', 'true');
    router.replace(pathname + '?' + params.toString());
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  if (!markList) {
    return (
      <DataLoadingPlaceholder
        image={noDataFoundSvg}
        description="No analytics data available."
      />
    );
  }

  return (
    <section className="space-y-4 rounded-md bg-white p-6">
      {/* ── Controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Mode switch */}
        <div className="flex items-center gap-2">
          <Switch
            id="customRangeType"
            checked={rangeMode === 'SubjectMarks'}
            onCheckedChange={(v) =>
              setRangeMode(v ? 'SubjectMarks' : 'TotalMarks')
            }
          />
          <label htmlFor="customRangeType" className="text-sm font-semibold">
            {rangeMode === 'SubjectMarks' ? 'Subject Marks' : 'Total Marks'}
          </label>
        </div>

        {/* Add column */}
        <Button
          size="sm"
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-white"
          onClick={addColumn}
        >
          + Add Column
        </Button>
      </div>

      {/* ── Column range pickers ── */}
      <div className="flex flex-wrap gap-4 rounded-md border border-gray-100 bg-gray-50 p-4">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-md border bg-white p-3 shadow-sm"
          >
            {/* Label input */}
            <input
              className="w-full rounded border border-gray-200 px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              value={col.label}
              onChange={(e) => updateColumnLabel(col.id, e.target.value)}
              placeholder="Column label"
            />

            {/* Range display */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{col.range[0]}</span>
              <span className="font-semibold text-primary">
                {col.range[0]} – {col.range[1]}
              </span>
              <span>{col.range[1]}</span>
            </div>

            {/* Dual-thumb slider */}
            <Slider
              min={0}
              max={100}
              step={1}
              value={col.range}
              sliderValues={col.range}
              onValueChange={(val) =>
                updateColumnRange(col.id, val as [number, number])
              }
            />

            {/* Remove */}
            <button
              className="mt-1 self-end text-xs text-red-400 hover:text-red-600"
              onClick={() => removeColumn(col.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* ── Analytics table ── */}
      {columns.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          Add at least one column to see the analysis.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary-300 text-center">
                <TableCell className="sticky left-0 z-10 bg-primary-300 font-semibold">
                  {rangeMode === 'SubjectMarks' ? 'Subject' : 'Overall'}
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col.id} className="text-center">
                    <Text className="text-sm font-semibold">
                      {col.label}
                      <span className="ml-1 block text-xs font-normal text-gray-500">
                        ({col.range[0]} – {col.range[1]})
                      </span>
                    </Text>
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Subject rows */}
              {rangeMode === 'SubjectMarks' &&
                subjectList?.map((subject, rowIdx) => (
                  <TableRow key={rowIdx} className="even:bg-gray-50">
                    <TableCell className="sticky left-0 z-10 bg-primary-300">
                      <Text className="font-semibold">
                        {subject.subject.name}
                      </Text>
                    </TableCell>
                    {columns.map((col) => {
                      const d = calcSubjectRange(col, subject.subject.id);
                      return (
                        <TableCell key={col.id} className="text-center">
                          <CellContent
                            d={d}
                            onTotal={() =>
                              openDialog(
                                d.students,
                                `${subject.subject.name} — ${col.label} (${col.range[0]}–${col.range[1]})`,
                                `Total: ${d.totalCount}`,
                                [subject],
                              )
                            }
                            onMale={() =>
                              openDialog(
                                d.maleStudents,
                                `Male — ${subject.subject.name} — ${col.label}`,
                                `Total Male: ${d.maleCount}`,
                                [subject],
                              )
                            }
                            onFemale={() =>
                              openDialog(
                                d.femaleStudents,
                                `Female — ${subject.subject.name} — ${col.label}`,
                                `Total Female: ${d.femaleCount}`,
                                [subject],
                              )
                            }
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}

              {/* Overall row (TotalMarks mode) */}
              {rangeMode === 'TotalMarks' && (
                <TableRow className="bg-green-50">
                  <TableCell className="sticky left-0 z-10 bg-green-100">
                    <Text className="font-semibold">Overall</Text>
                  </TableCell>
                  {columns.map((col) => {
                    const d = calcTotalRange(col);
                    return (
                      <TableCell key={col.id} className="text-center">
                        <CellContent
                          d={d}
                          onTotal={() =>
                            openDialog(
                              d.students,
                              `Total Marks — ${col.label} (${col.range[0]}–${col.range[1]})`,
                              `Total: ${d.totalCount}`,
                            )
                          }
                          onMale={() =>
                            openDialog(
                              d.maleStudents,
                              `Male — Total Marks — ${col.label}`,
                              `Total Male: ${d.maleCount}`,
                            )
                          }
                          onFemale={() =>
                            openDialog(
                              d.femaleStudents,
                              `Female — Total Marks — ${col.label}`,
                              `Total Female: ${d.femaleCount}`,
                            )
                          }
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <OverallStudentListDialog
        studentList={modalStudentList}
        title={modalTitle}
        subTitle={modalSubTitle}
        subjectList={modalSubjectList}
      />
    </section>
  );
}

// ─── Small cell sub-component ─────────────────────────────────────────────────

function CellContent({
  d,
  onTotal,
  onMale,
  onFemale,
}: {
  d: ReturnType<typeof Object.create>;
  onTotal: () => void;
  onMale: () => void;
  onFemale: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Button
        variant="ghost"
        className="h-auto py-0 text-sm font-semibold text-black"
        onClick={onTotal}
      >
        {d.totalCount}{' '}
        <span className="text-xs text-gray-500">
          ({d.overallPercentage.toFixed(1)}%)
        </span>
      </Button>
      <div className="flex gap-2 text-xs">
        <Button
          variant="ghost"
          className="h-auto py-0 text-xs font-medium text-blue-600"
          onClick={onMale}
        >
          M: {d.maleCount} ({d.malePercentage.toFixed(1)}%)
        </Button>
        <Button
          variant="ghost"
          className="h-auto py-0 text-xs font-medium text-pink-500"
          onClick={onFemale}
        >
          F: {d.femaleCount} ({d.femalePercentage.toFixed(1)}%)
        </Button>
      </div>
    </div>
  );
}
