'use client';

import { useGetExamSubjectMasterByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectMasterByClassSectionIdQuery';
import { useGetExamSubjectsByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectsByClassSectionIdQuery';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

import { OverallStudentListDialog } from '../_modals/OverallStudentListDialog';
// import dataSegmentationGif from '../../../../public/assets/images/data-segmentation.gif';

type StatusGroup = {
  male: number;
  female: number;
  overall: number;
  students: any[];
  maleStudents: any[];
  femaleStudents: any[];
};

export default function SubjectwiseCountAnalysisTable({
  students,
  classId,
  examId,
  sectionId,
}: {
  students: any[];
  subjectCount: number;
  classId: string;
  sectionId?: string;
  examId: string;
}) {
  interface AnalyticsModel {
    subjectCount: number;
    numberOfPassStudents: StatusGroup;
    numberOfFailStudents: StatusGroup;
  }
  const [subjectCountWiseStatusCount, setSubjectCountWiseStatusCount] =
    useState<AnalyticsModel[]>([]);

  const [modalStudentList, setModalStudentList] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSubTitle, setModalSubTitle] = useState('');

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: subjectMasterList } =
    useGetExamSubjectMasterByClassSectionIdQuery(
      sectionId ? { examId, classId, sectionId } : { examId, classId },
      { enabled: !!examId && !!classId }
    );

  // Full subject config (with mark partitions) so the student dialog can render
  // the per-subject mark breakdown, mirroring the Range analytics dialog.
  const { data: subjectConfigList } = useGetExamSubjectsByClassSectionIdQuery(
    { examId, classId, sectionId },
    { enabled: !!examId && !!classId }
  );

  useEffect(() => {
    const emptyGroup = (): StatusGroup => ({
      male: 0,
      female: 0,
      overall: 0,
      students: [],
      maleStudents: [],
      femaleStudents: [],
    });

    const overallStatusCount: AnalyticsModel[] = [];
    for (let i = 0; i < (subjectMasterList?.length || 0); i++) {
      const subjectWiseStatusCount: AnalyticsModel = {
        subjectCount: i + 1,
        numberOfPassStudents: emptyGroup(),
        numberOfFailStudents: emptyGroup(),
      };

      students.forEach((student) => {
        const gender = student?.gender?.toLowerCase();
        if (student['subjectPassed'] == i + 1) {
          const group = subjectWiseStatusCount.numberOfPassStudents;
          group.overall++;
          group.students.push(student);
          if (gender === 'male') {
            group.male++;
            group.maleStudents.push(student);
          } else if (gender === 'female') {
            group.female++;
            group.femaleStudents.push(student);
          }
        }
        if (student['subjectFailed'] == i + 1) {
          const group = subjectWiseStatusCount.numberOfFailStudents;
          group.overall++;
          group.students.push(student);
          if (gender === 'male') {
            group.male++;
            group.maleStudents.push(student);
          } else if (gender === 'female') {
            group.female++;
            group.femaleStudents.push(student);
          }
        }
      });
      overallStatusCount.push(subjectWiseStatusCount);
    }

    setSubjectCountWiseStatusCount(overallStatusCount);
  }, [students, subjectMasterList]);

  function handleOpenStudentListDialog(
    studentList: any[],
    title: string,
    subTitle: string
  ) {
    if (!studentList || studentList.length === 0) return;
    const sortedStudents = [...studentList].sort(
      (a, b) => parseFloat(b.totalMark) - parseFloat(a.totalMark)
    );
    setModalStudentList(sortedStudents);
    setModalTitle(title);
    setModalSubTitle(subTitle);

    const params = new URLSearchParams(searchParams.toString());
    params.set('isListDialogOpen', 'true');
    router.replace(pathname + '?' + params.toString());
  }

  function CountCell({
    group,
    label,
  }: {
    group: StatusGroup;
    label: string;
  }) {
    return (
      <TableCell>
        <div className="flex flex-col justify-evenly">
          <Button
            variant="ghost"
            disabled={group.overall === 0}
            className="size-lg text-center font-semibold text-black disabled:opacity-60"
            onClick={() =>
              handleOpenStudentListDialog(
                group.students,
                label,
                `Total Students: ${group.overall}`
              )
            }
          >
            {group.overall}
          </Button>
          <div className="flex justify-evenly">
            <Button
              variant="ghost"
              disabled={group.male === 0}
              className="text-primary-800 disabled:opacity-60"
              onClick={() =>
                handleOpenStudentListDialog(
                  group.maleStudents,
                  `Male - ${label}`,
                  `Total Male Students: ${group.male}`
                )
              }
            >
              M: {group.male}
            </Button>
            <Button
              variant="ghost"
              disabled={group.female === 0}
              className="text-primary-800 disabled:opacity-60"
              onClick={() =>
                handleOpenStudentListDialog(
                  group.femaleStudents,
                  `Female - ${label}`,
                  `Total Female Students: ${group.female}`
                )
              }
            >
              F: {group.female}
            </Button>
          </div>
        </div>
      </TableCell>
    );
  }

  return (
    <section className="space-y-2 rounded-md bg-white p-6">
      <Table>
        <TableHeader>
          <TableRow className="mt-5 bg-primary-300 text-center">
            <TableCell></TableCell>
            <TableCell className="text-center font-semibold">
              Fail Count
            </TableCell>
            <TableCell>
              <Text className="size-lg font-semibold">Pass Count</Text>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjectCountWiseStatusCount.map((subject) => (
            <TableRow className="mt-5 text-center" key={subject.subjectCount}>
              <TableCell className="bg-primary-300">
                <Text className="size-lg font-semibold">
                  {subject.subjectCount} Subject(s)
                </Text>
              </TableCell>
              <CountCell
                group={subject.numberOfFailStudents}
                label={`Students who failed ${subject.subjectCount} subject(s)`}
              />
              <CountCell
                group={subject.numberOfPassStudents}
                label={`Students who passed ${subject.subjectCount} subject(s)`}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <OverallStudentListDialog
        studentList={modalStudentList}
        title={modalTitle}
        subTitle={modalSubTitle}
        subjectList={subjectConfigList || []}
      />
    </section>
  );
}
