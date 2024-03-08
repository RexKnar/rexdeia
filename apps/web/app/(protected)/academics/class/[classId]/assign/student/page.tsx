import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { AssignStudents } from './_components/AssignStudent';
import { AssignStudentsPageHeader } from './_components/AssignStudentsPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/exams/examId');
  }

  return (
    <section className="flex flex-col gap-6">
      <AssignStudentsPageHeader />
      <section>
        <AssignStudents />
      </section>
    </section>
  );
}
