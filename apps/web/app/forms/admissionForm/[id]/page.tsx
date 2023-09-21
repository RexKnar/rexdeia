import React from 'react';

import { Form } from '../../../../lib/components/shared/Form';
import { searchForms } from '../../../api/forms/service';

export default async function Page({ params }: { params: { id: string } }) {
  const admissionForms = await searchForms({
    type: 'Admission',
    organizationId: params.id,
  });
  const form = admissionForms[0];
  return (
    <>
      <Form formConfig={form} />;
    </>
  );
}
