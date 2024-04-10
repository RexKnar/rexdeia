'use client';
import { useEffect, useRef } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Input } from 'ui';

export function MarkFields({
  nestIndex,
  control,
  assessmentFormats,
  assessmentId,
  subjectIndex,
}) {
  const { fields, append } = useFieldArray({
    control,
    name: `studentsMarkDetails.${nestIndex}].subjects.${subjectIndex}.marks`,
  });

  const prevAssessmentFormats = useRef(null);
  const prevAssessmentId = useRef(null);

  useEffect(() => {
    if (
      assessmentFormats === prevAssessmentFormats.current &&
      assessmentId === prevAssessmentId.current
    ) {
      return;
    }

    if (assessmentFormats) {
      const newFields = assessmentFormats.examConfiguration
        .filter((config) => config.assessmentFormat != null)
        .map((config) => ({
          academicExamId: assessmentId,
          attendance: '',
          mark: '',
          assessmentFormatId: config.assessmentFormat.id || '',
          assessmentFormatName: config.assessmentFormat.name || '',
        }));
      append(newFields);
    }

    prevAssessmentFormats.current = assessmentFormats;
    prevAssessmentId.current = assessmentId;
  }, [assessmentFormats, assessmentId, append]);

  return (
    <div className="flex w-full">
      {fields.map((field, formatIndex) => (
        <Input
          key={formatIndex}
          type="text"
          placeholder={field['assessmentFormatName']}
          {...control.register(
            `studentsMarkDetails.${nestIndex}.subjects.${subjectIndex}.marks.${formatIndex}.mark`
          )}
        />
      ))}
    </div>
  );
}
