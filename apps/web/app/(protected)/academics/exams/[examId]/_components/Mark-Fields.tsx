'use client';

import { useEffect, useRef } from 'react';
import { useFieldArray } from 'react-hook-form';

import { MarkInput } from './Mark-Input';

export function MarkFields({
  nestIndex,
  control,
  assessmentFormats,
  subjectIndex,
  markEnteredAssessmentFormat,
}) {
  const { fields, append } = useFieldArray({
    control,
    name: `studentsMarkDetails.${nestIndex}].subjects.${subjectIndex}.marks`,
  });

  const prevAssessmentFormats = useRef(null);

  useEffect(() => {
    if (assessmentFormats === prevAssessmentFormats.current) {
      return;
    }

    if (assessmentFormats) {
      const newFields = assessmentFormats
        .filter((config) => config.assessmentFormat !== null)
        .map((config) => {
          let markEnteredFormatIndex = markEnteredAssessmentFormat
            ? markEnteredAssessmentFormat?.findIndex(
                (obj) => obj.assessmentFormatId === config.assessmentFormat.id
              )
            : false;

          let mark =
            markEnteredFormatIndex > -1
              ? markEnteredAssessmentFormat[markEnteredFormatIndex].mark
              : false;
          let markId =
            markEnteredAssessmentFormat[markEnteredFormatIndex]?.id || null;
          return {
            id: markId,
            academicExamId: config.academicExamId,
            attendance: null,
            mark: mark ? mark : null,
            isUpdate: mark ? true : false,
            assessmentFormatId: config.assessmentFormat.id || null,
            assessmentFormatName: config.assessmentFormat.name || null,
          };
        });
      append(newFields);
    }

    prevAssessmentFormats.current = assessmentFormats;
  }, [assessmentFormats]);
  return (
    <div className="flex w-full space-x-2">
      {fields.map((field, formatIndex) => {
        const currentFormatIndex = assessmentFormats.findIndex(
          (obj) => obj.assessmentFormat?.id === fields['assessmentFormatId']
        );

        return (
          <MarkInput
            key={field.id}
            control={control}
            validationData={assessmentFormats[currentFormatIndex]}
            registerKey={`studentsMarkDetails.${nestIndex}.subjects.${subjectIndex}.marks.${formatIndex}`}
            fieldName={field['assessmentFormatName']}
          />
        );
      })}
    </div>
  );
}
