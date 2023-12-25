import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { AddStudentPage } from './components/AddStudentPage';
import { EnrollStudentHeader } from './components/EnrollStudentHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/students/enroll-new-student');
  }

  return (
    <section>
      <EnrollStudentHeader />
      <AddStudentPage
        branchId={session.branchId}
        organizationId={session.organizationId}
      />
    </section>
  );
}
