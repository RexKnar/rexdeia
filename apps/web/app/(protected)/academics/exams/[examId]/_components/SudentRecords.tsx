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
    }
  );
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
            <div className="flex-none w-1/5">
              {studentList[index]?.firstName}
              {studentList[index]?.middleName}
              {studentList[index]?.lastName}
            </div>

            <AssessmentSubjects nestIndex={index} {...{ control, register }} />
          </div>
        );
      })}
    </div>
  );
}
