import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { ProfileDashBoard } from './_components/ProfileDashBoard';
import { ProfilePageHeader } from './_components/ProfilePageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=//users/profile');
  }
  return (
    <section className="flex flex-col gap-6">
      <ProfilePageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <ProfileDashBoard />
      </section>
    </section>
  );
}
