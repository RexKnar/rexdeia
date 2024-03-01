import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { DepartmentList } from '@/components/department/departmentList';

import { authOptions } from '../../../../lib/auth';
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
    console.error(error);
  }
}
