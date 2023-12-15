import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { PageTitle } from '../../../../lib/components/PageTitle';
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
      <PageTitle title="Enroll New Student" />

      <AddStudentPage
        branchId={session.branchId}
        organizationId={session.organizationId}
      />
    </section>
  );
}
