import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { AddStudentPage } from '../components/AddStudentPage';
import { PathBreadcrumb } from '../../../../lib/components/PathBreadcrumb';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/students/add');
  }

  return (
    <section className="flex h-full w-full flex-col gap-[20px] bg-gray-50 px-[25px] py-[40px] sm:px-[50px]">
      <PathBreadcrumb />

      <AddStudentPage
        branchId={session.branchId}
        organizationId={session.organizationId}
      />
    </section>
  );
}
