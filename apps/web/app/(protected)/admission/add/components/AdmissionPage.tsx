import { AdmissionForm } from '../../../../../lib/components/admission/AdmissionForm';
import { getFormByCriteria } from '../../../../api/forms/service';

type AdmissionPageProp = {
  branchId: string;
  organizationId: string;
};

export async function AdmissionPage({
  branchId,
  organizationId,
}: AdmissionPageProp) {
  const admissionForm = await getFormByCriteria({
    type: 'Admission',
    branchId: branchId,
    organizationId: organizationId,
  });

  return <AdmissionForm formConfig={admissionForm} formId={admissionForm.id} />;
}
