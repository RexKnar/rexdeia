import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { StudentsMarks } from './_components/StudentMarks';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/analytics/students-list');
  }

  return (
    <section className="space-y-2 rounded-md bg-white p-4">
      <StudentsMarks />
    </section>
  );
}
