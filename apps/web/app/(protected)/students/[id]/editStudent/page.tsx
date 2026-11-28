import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { authOptions } from 'lib/auth';
import { resolveUserSecurityContext } from 'lib/auth/scope-resolver';

import { EditStudentDetail } from './components/EditStudentForm';
import { EditStudentHeader } from './components/EditstudentHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/login');
  }

  const security = await resolveUserSecurityContext(session);
  if (!security.canEditStudents) {
    redirect('/students/list');
  }

  return (
    <section>
      <Suspense>
        <EditStudentHeader />
        <EditStudentDetail />
      </Suspense>
    </section>
  );
}
