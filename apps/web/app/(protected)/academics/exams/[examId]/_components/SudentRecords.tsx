'use client';

import { useGetStudentsByClassSectionQuery } from 'lib/queries/mark-entry/useGetStudentsByClassSectionQuery';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { cn } from 'utils';

import { AssessmentSubjects } from './assessment-subjects';

export function StudentRecords({ control, register }) {
  const { fields, append } = useFieldArray({
    control,
    name: 'studentsMarkDetails',
  });
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const sectionId = searchParams.get('sectionId');

  const { data: studentList } = useGetStudentsByClassSectionQuery(
    { classId, sectionId },
    {
      enabled: !!sectionId,
      queryKey: [],
    }
  );
  // const studentList = [
  //   {
  //     student: {
  //       id: '655fe8a4-9280-44a7-8e31-197857fbfa4a',
  //       firstName: 'Gopi',
  //       middleName: 'etyu',
  //       lastName: 'Kumar',
  //     },
  //   },
  //   {
  //     student: {
  //       id: 'bf429840-545c-42b7-ba2c-9fe9045d5c02',
  //       firstName: 'sasi',
  //       middleName: 'tit',
  //       lastName: 'Kumar',
  //     },
  //   },
  //   {
  //     student: {
  //       id: '9b79c5b0-37e5-47d7-a43f-531f655d5f5b',
  //       firstName: 'sasi',
  //       middleName: 'tit',
  //       lastName: 'Kumar',
  //     },
  //   },
  //   {
  //     student: {
  //       id: 'c9db8c6f-d6e4-4ea9-99ce-a6be44206a2a',
  //       firstName: 'Gopi',
  //       middleName: 'r4fr',
  //       lastName: 'Kumar',
  //     },
  //   },
  // ];
  useEffect(() => {
    if (fields.length === 0 && studentList) {
      studentList?.forEach((studentDetail) => {
        append({
          studentId: studentDetail.id,
        });
      });
    }
  }, [studentList]);

  return (
    <div>
      {fields.map((student, index) => {
        return (
          <div
            key={index}
            className={cn(
              `flex w-full items-center justify-between bg-green-100 `
            )}
          >
            <div className="w-1/5 flex-none">
              {studentList[index]?.firstName}
              {studentList[index]?.middleName}
              {studentList[index]?.lastName}
            </div>

            <AssessmentSubjects nestIndex={index} {...{ control, register }} />
          </div>
          // </div>
        );
      })}
    </div>
  );
}
