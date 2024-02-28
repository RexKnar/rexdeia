import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import { Assessment } from './_components/assessment';
import { AssessmentPageHeader } from './_components/AssessmentpageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/exams/examId');
  }

  return (
    <section className="flex flex-col gap-6">
      <AssessmentPageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <Assessment />
      </section>
    </section>
  );
}
