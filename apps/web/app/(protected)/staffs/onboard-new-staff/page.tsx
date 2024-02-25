import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { PageTitle } from '@/components/PageTitle';

import { authOptions } from '../../../../lib/auth';
import { OnboardStaffForm } from './_components/OnboardStaffForm';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/staffs/onboard-new-staff');
  }

  return (
    <section>
      <PageTitle title="Onboard New Staff" />
      <OnboardStaffForm />
    </section>
  );
}
