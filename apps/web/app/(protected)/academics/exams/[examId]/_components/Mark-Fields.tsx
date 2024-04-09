'use client';
import { useEffect, useRef } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Input } from 'ui';

export function MarkFields({
  nestIndex,
  register,
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
      return; // No need to execute the effect again
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
    // <div key={nestIndex} className="flex-none w-1/5 p-1 bg-green-100">
    <div className="flex w-full">
      {fields.map((field, formatIndex) => (
        // <div key={field.id} className="p-4 p-5 bg-green-100 ">
        <Input
          key={formatIndex}
          type="text"
          placeholder={field?.assessmentFormatName}
          {...control.register(
            `studentsMarkDetails.${nestIndex}.subjects.${subjectIndex}.marks.${formatIndex}.mark`
          )}
        />
        // </div>
      ))}
    </div>
    // </div>
  );
}
