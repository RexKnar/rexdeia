import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { DepartmentList } from '../../../../lib/components/department/departmentList';
import { getDepartmentList } from '../../../api/department/service';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/department');
  }
  try {
    const apiResponse = await getDepartmentList({
      branchId: session.branchId,
    });
    return (
      <div className="flex flex-col">
        <DepartmentList departmentList={apiResponse} />
      </div>
    );
  } catch (error) {
    console.log(error);
  }
}
