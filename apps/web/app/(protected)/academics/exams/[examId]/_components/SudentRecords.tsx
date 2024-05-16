'use client';

import { useGetMarkEntryFormStructureQuery } from 'lib/queries/mark-entry/useGetStudentsByClassSectionQuery';
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
  const examId = searchParams.get('examId');

  const { data: markEntryFormStructure } = useGetMarkEntryFormStructureQuery(
    { classId, examId },
    {
      enabled: !!examId,
    }
  );
  useEffect(() => {
    if (fields.length === 0 && markEntryFormStructure) {
      markEntryFormStructure?.forEach((studentDetail) => {
        append({
          studentId: studentDetail.id,
        });
      });
    }
  }, [markEntryFormStructure]);

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
              {markEntryFormStructure[index]?.name}
            </div>

            {/* <AssessmentSubjects
              nestIndex={index}
              subjects={markEntryFormStructure[index]?.subjects}
              {...{ control, register }}
            /> */}
          </div>
        );
      })}
    </div>
  );
}
