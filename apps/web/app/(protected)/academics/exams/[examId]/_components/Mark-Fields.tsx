'use client';
import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

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
    name: `studentsMarkDetails.${nestIndex}.subjects.${subjectIndex}.marks`,
  });
  console.log(assessmentFormats[subjectIndex]);
  console.log(subjectIndex);

  useEffect(() => {
    if (assessmentFormats) {
      assessmentFormats.examConfiguration.forEach((config) => {
        if (config.assessmentFormat != null) {
          append({
            academicExamId: assessmentId,
            attendance: '',
            mark: '',
            assessmentFormatId: config.assessmentFormat.id || '',
            assessmentFormatName: config.assessmentFormat.name || '',
          });
        }
      });
    }
  }, []);

  return (
    <div key={nestIndex} className="flex bg-green-100 p-1">
      {fields.map((field, formatIndex) => {
        return (
          <div key={field.id} className="bg-green-100 p-4 p-5 ">
            <input
              type="text"
              placeholder={field?.[`assessmentFormatName`]}
              {...register(
                `studentsMarkDetails.${nestIndex}.marks[${formatIndex}].mark`
              )}
            />
            <input
              type="hidden"
              {...register(
                `studentsMarkDetails.${nestIndex}.marks[${formatIndex}].assessmentFormatId`
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
