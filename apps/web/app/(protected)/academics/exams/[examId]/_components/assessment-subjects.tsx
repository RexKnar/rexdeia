'use client';

import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

import { MarkFields } from './Mark-Fields';

export function AssessmentSubjects({
  nestIndex,
  subjects,
  control,
  markEnteredSubjects,
}) {
  const { fields, append } = useFieldArray({
    control,
    name: `studentsMarkDetails.${nestIndex}.subjects`,
  });
  useEffect(() => {
    console.log(markEnteredSubjects);
    if (fields.length === 0 && subjects) {
      subjects.forEach((subject) => {
        append({
          subjectId: subject.id,
        });
      });
    }
  }, [subjects]);

  useEffect(() => {
    console.log(markEnteredSubjects);
  }, [markEnteredSubjects]);

  return (
    <>
      {fields.map((subject, subjectIndex) => {
        let markEnteredSubjectIndex = markEnteredSubjects
          ? markEnteredSubjects?.indexOf((obj) => obj?.id === subject?.id)
          : null;
        const subjectDetails = markEnteredSubjectIndex
          ? markEnteredSubjects[markEnteredSubjectIndex]?.assessmentFormat
          : [];
        return (
          <td key={subject.id} className="px-6 py-4 whitespace-nowrap">
            <div>
              <MarkFields
                nestIndex={nestIndex}
                subjectIndex={subjectIndex}
                control={control}
                assessmentFormats={subjects[subjectIndex]?.assessmentFormat}
                markEnteredAssessmentFormat={subjectDetails}
              />
            </div>
          </td>
        );
      })}
    </>
  );
}
