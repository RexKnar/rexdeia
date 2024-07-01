import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '../../../../lib/auth';
import { ClassList } from './_components/ClassList';
import { ClassPageHeader } from './_components/ClassPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/class');
  }

  return (
    <section className="flex flex-col gap-6">
      <ClassPageHeader />
      <section className="space-y-2 rounded-md bg-white py-4">
        <ClassList />
      </section>
    </section>
  );
}
