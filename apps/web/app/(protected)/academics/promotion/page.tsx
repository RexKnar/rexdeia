import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { AssignPromotion } from './_components/AssignPromotion';
import { AssignPromotionPageHeader } from './_components/AssignPromotionPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/exams/examId');
  }

  return (
    <section className="flex flex-col gap-6">
      <AssignPromotionPageHeader />
      <section>
        <AssignPromotion />
      </section>
    </section>
  );
}
