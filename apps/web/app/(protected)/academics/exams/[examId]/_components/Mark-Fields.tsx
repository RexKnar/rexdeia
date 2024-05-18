'use client';

import { useEffect, useRef } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Input } from 'ui';

export function MarkFields({
  nestIndex,
  control,
  assessmentFormats,
  subjectIndex,
  markEnteredAssessmentFormat,
}) {
  // console.log(markEnteredAssessmentFormat);
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
          return {
            academicExamId: config.academicExamId,
            attendance: '',
            mark: mark ? mark : '',
            isUpdate: mark ? true : false,
            assessmentFormatId: config.assessmentFormat.id || '',
            assessmentFormatName: config.assessmentFormat.name || '',
          };
        });
      append(newFields);
    }

    prevAssessmentFormats.current = assessmentFormats;
  }, [assessmentFormats]);
  return (
    <div className="flex w-full">
      {fields.map((field, formatIndex) => {
        return (
          <Input
            key={formatIndex}
            type="text"
            placeholder={field['assessmentFormatName']}
            {...control.register(
              `studentsMarkDetails.${nestIndex}.subjects.${subjectIndex}.marks.${formatIndex}.mark`
            )}
          />
        );
      })}
    </div>
  );
}
