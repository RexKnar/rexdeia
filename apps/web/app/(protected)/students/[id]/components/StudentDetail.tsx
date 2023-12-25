import { Text } from 'ui';
import React from 'react';

type StudentDetailProps = {
  formSections: any;
};

export function StudentDetail({ formSections }: StudentDetailProps) {
  return (
    <section>
      {formSections.map((section) => (
        <section
          key={section.sectionTitle}
          className="mt-4 rounded-md bg-white p-6"
        >
          <Text variant="sm-semibold">{section.sectionTitle}</Text>
          <div className="mt-8 flex flex-wrap gap-12">
            {section.sectionFields.map((field) => (
              <div key={field.name}>
                <label className="text-sm font-semibold text-gray-700">
                  {field.label}
                </label>
                <Text variant="base-regular">
                  {field.value ? field.value : 'N/A'}
                </Text>
              </div>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
