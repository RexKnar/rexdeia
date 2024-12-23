'use client';

import { useEffect, useRef } from 'react';
import { useFieldArray } from 'react-hook-form';

import { MarkInput } from './Mark-Input';

export function MarkFields({
  nestIndex,
  control,
  examSubjectPartition,
  subjectIndex,
}) {
  const { fields, append } = useFieldArray({
    control,
    name: `studentsMarkDetails.${nestIndex}].subjects.${subjectIndex}.marks`,
  });

  const prevAssessmentFormats = useRef(null);

  useEffect(() => {
    if (examSubjectPartition === prevAssessmentFormats.current) {
      return;
    }

    if (examSubjectPartition) {
      const newFields = examSubjectPartition
        .filter((config) => config.assessmentFormat !== null)
        .map((partition) => {
          return {
            id: partition?.Mark?.id || null,
            examPartitionId: partition.id,
            attendance: partition?.Mark?.attandance || null,
            mark: partition?.Mark?.mark || null,
            isUpdate: partition?.Mark?.id ? true : false,
            assessmentFormatId: partition.assessmentFormat.id || null,
            assessmentFormatName: partition.assessmentFormat.name || null,
          };
        });
      append(newFields);
    }

    prevAssessmentFormats.current = examSubjectPartition;
  }, [append, examSubjectPartition]);
  return (
    <div className="flex w-full space-x-2">
      {fields.map((field, formatIndex) => {
        return (
          examSubjectPartition && (
            <MarkInput
              key={field.id}
              control={control}
              attendance={field['attendance']}
              validationData={examSubjectPartition[formatIndex]}
              registerKey={`studentsMarkDetails.${nestIndex}.subjects.${subjectIndex}.marks.${formatIndex}`}
              fieldName={field['assessmentFormatName']}
            />
          )
        );
      })}
    </div>
  );
}
