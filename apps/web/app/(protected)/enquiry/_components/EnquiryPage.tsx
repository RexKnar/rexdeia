import { EnquiryForm } from '@/components/admission/EnquiryForm';

import { getFormByCriteria } from '../../../api/forms/service';

type EnquiryPageProp = {
  branchId: string;
  organizationId: string;
};

export async function EnquiryPage({
  branchId,
  organizationId,
}: EnquiryPageProp) {
  const enquiryForm = await getFormByCriteria({
    type: 'Enquiry',
    branchId: branchId,
    organizationId: organizationId,
  });

  return <EnquiryForm formConfig={enquiryForm} formId={enquiryForm.id} />;
}
