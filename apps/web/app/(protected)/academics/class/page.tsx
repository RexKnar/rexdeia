import { PageHeader } from '../../../../lib/components/PageHeader';
import { PathBreadcrumb } from '../../../../lib/components/PathBreadcrumb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { redirect } from 'next/navigation';
import { ClassList } from './components/ClassListTable';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/class');
  }

  return (
    <section className="w-full bg-gray-50 p-3">
      <div className="mx-6 mt-8">
        <PathBreadcrumb />
      </div>
      <div className="mx-auto my-5 rounded-md bg-white p-6">
        <PageHeader title="Students List" className="mb-3" />
        <ClassList />
      </div>
    </section>
  );
}
