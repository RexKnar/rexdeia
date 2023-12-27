import { getFormByCriteria } from '../../../../api/forms/service';
import { AddStudentForm } from './AddStudentForm';

type AddStudentPageProps = {
  readonly branchId: string;
  readonly organizationId: string;
};

export async function AddStudentPage({
  branchId,
  organizationId,
}: AddStudentPageProps) {
  const studentForm = await getFormByCriteria({
    type: 'Admission',
    branchId: branchId,
    organizationId: organizationId,
  });

  return <AddStudentForm formConfig={studentForm} formId={studentForm.id} />;
}
