'use client';

import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

import { MarkFields } from './Mark-Fields';

export function AssessmentSubjects({ nestIndex, subjects, control }) {
  const { fields, append } = useFieldArray({
    control,
    name: `studentsMarkDetails.${nestIndex}.subjects`,
  });
  useEffect(() => {
    if (fields.length === 0 && subjects) {
      subjects.forEach((subject) => {
        append({
          subjectId: subject.id,
        });
      });
    }
  }, [subjects]);

  return (
    <>
      {fields.map((subject, subjectIndex) => (
        <td key={subject.id} className="whitespace-nowrap px-6 py-4">
          <div>
            <MarkFields
              nestIndex={nestIndex}
              subjectIndex={subjectIndex}
              control={control}
              assessmentFormats={subjects[subjectIndex]?.assessmentFormat}
            />
          </div>
        </td>
      ))}
    </>
  );
}
