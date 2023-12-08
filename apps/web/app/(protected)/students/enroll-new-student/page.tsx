import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { PageHeader } from '../../../../lib/components/PageHeader';
import { PathBreadcrumb } from '../../../../lib/components/PathBreadcrumb';
import { AddStudentPage } from './components/AddStudentPage';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/students/add');
  }

  return (
    <section>
      <PathBreadcrumb />
      <PageHeader title="Enroll New Student" />

      <AddStudentPage
        branchId={session.branchId}
        organizationId={session.organizationId}
      />
    </section>
  );
}
