'use client';

import { useGetSubjectsWithFormatsQuery } from 'lib/queries/mark-entry/useGetSubjectsWithFormatsQuery';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { cn } from 'utils';

import { MarkFields } from './Mark-Fields';

export function AssessmentSubjects({ nestIndex, subjects, control }) {
  const { fields, append } = useFieldArray({
    control,
    name: `studentsMarkDetails.${nestIndex}.subjects`,
  });
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const sectionId = searchParams.get('sectionId');
  const examId = searchParams.get('examId');
  const { data: subjectsWithFormats } = useGetSubjectsWithFormatsQuery(
    { classId, sectionId, examId },
    {
      enabled: !!examId,
    }
  );
  const columnColor = [
    'bg-green-100',
    'bg-red-100 ',
    'bg-primary-100 ',
    'bg-yellow-100 ',
    'bg-purple-100 ',
    'bg-green-100',
    'bg-red-100 ',
    'bg-primary-100 ',
    'bg-yellow-100 ',
    'bg-purple-100 ',
  ];
  useEffect(() => {
    if (fields.length === 0 && subjects) {
      subjects.forEach((subject, index) => {
        if (subjects[index]) {
          append({
            subjectId: subject.id,
          });
        }
      });
    }
  }, [subjects]);

  return (
    <>
      {fields.map((subject, subjectIndex) => (
        <div
          key={subjectIndex}
          className={cn(
            'w-2/5 flex-none border-l-2 border-black bg-green-100 p-1 p-4',
            columnColor[subjectIndex % 10]
          )}
        >
          {/* {subjects && subjectsWithFormats ? (
            <MarkFields
              nestIndex={nestIndex}
              subjectIndex={subjectIndex}
              control={control}
              assessmentFormats={subjects[subjectIndex]?.assessmentFormat}
              assessmentId={subjectsWithFormats[subjectIndex]?.id}
            />
          ) : (
            'loading'
          )} */}
        </div>
      ))}
    </>
  );
}
