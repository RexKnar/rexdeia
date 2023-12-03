import { AddStudentForm } from '../../../../../lib/components/student/AddStudentForm';
import { getFormByCriteria } from '../../../../api/forms/service';

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
