
import React from 'react';
import { AdmissionForm } from '../../../lib/components/shared/AdmissionForm';
import { searchForms } from '../../api/forms/service';

export default async function Page({ params }: { params: { id: string } }) {
  const admissionForms = await searchForms({
    type: 'Admission',
    organizationId: params.id,
  });
  const admissionForm = admissionForms[0];
  return (
    <>
    <AdmissionForm formConfig={admissionForm} />;
    </>
  );
}
