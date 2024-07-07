'use client';

import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { TableCell } from 'ui/components/ui/Table';

import { MarkFields } from './Mark-Fields';

export function ExamSubjects({ nestIndex, examSubjects, control }) {
  const { fields, append } = useFieldArray({
    control,
    name: `studentsMarkDetails.${nestIndex}.subjects`,
  });
  useEffect(() => {
    if (fields.length === 0 && examSubjects) {
      examSubjects.forEach((examSubject) => {
        append({
          subjectId: examSubject.subject.id,
          examSubjectId: examSubject.id,
        });
      });
    }
  }, [examSubjects]);

  return (
    <>
      {fields.map((examSubject, subjectIndex) => {
        return (
          <TableCell
            key={examSubject.id}
            className={`w-[150px] whitespace-nowrap px-6 py-4 lg:w-[300px] ${subjectIndex === 0 ? 'ml-[350px]' : ''}`}
          >
            <div>
              <MarkFields
                nestIndex={nestIndex}
                subjectIndex={subjectIndex}
                control={control}
                examSubjectPartition={
                  examSubjects[subjectIndex]?.examSubjectPartition
                }
              />
            </div>
          </TableCell>
        );
      })}
    </>
  );
}
