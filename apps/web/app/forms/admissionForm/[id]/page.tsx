import { Form } from '../../../../lib/components/shared/Form';
import { getFormByCriteria } from '../../../api/forms/service';

export default async function Page({ params }: { params: { id: string } }) {
  const admissionForms = await getFormByCriteria({
    type: 'Admission',
    organizationId: params.id,
    branchId: '5f1f0f1a0b1eaf001c3f2b1e', // TODO: get branchId from user
  });
  const form = admissionForms[0];
  return <Form formConfig={form} />;
}
