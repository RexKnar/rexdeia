import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { PageHeader } from '../../../../lib/components/PageHeader';
import { PathBreadcrumb } from '../../../../lib/components/PathBreadcrumb';
import { ClassList } from './components/ClassListTable';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/class');
  }

  return (
    <section>
      <PathBreadcrumb />

      <div className="mx-auto my-5 rounded-md bg-white p-6">
        <PageHeader title="Students List" className="mb-3" />
        <ClassList />
      </div>
    </section>
  );
}
