import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { AddStudentPage } from '../components/AddStudentPage';
import { AddStudentBreadcrumb } from '../components/AddStudentBreadCrumb';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/student/add');
  }

  return (
    <section className="flex h-full w-full flex-col gap-[20px] bg-gray-50 px-[25px] py-[40px] sm:px-[50px]">
      <AddStudentBreadcrumb />

      <AddStudentPage
        branchId={session.branchId}
        organizationId={session.organizationId}
      />
    </section>
  );
}
