import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { AddStudentForm } from './_components/AddStudentForm';
import { EnrollStudentHeader } from './_components/EnrollStudentHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/students/enroll-new-student');
  }

  return (
    <section>
      <EnrollStudentHeader />
      <AddStudentForm />
    </section>
  );
}
