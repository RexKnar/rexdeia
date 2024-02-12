import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { CategoryListTable } from './_components/CategoryListTable';
import { CategoryPageHeader } from './_components/CategoryPageHeader';
import { CategoryFlyout } from './_components/modals/SaveCategoryFlyout';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/batches');
  }

  return (
    <section className="flex flex-col gap-6">
      <CategoryPageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <CategoryListTable />
        <CategoryFlyout />
      </section>
    </section>
  );
}
