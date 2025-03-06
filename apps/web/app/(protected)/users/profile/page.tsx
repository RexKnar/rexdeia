import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { ProfilePageHeader } from './_components/ProfilePageHeader';
import { ProfileDetails } from './_components/ProfileDetails';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=//users/profile');
  }
  return (
    <section className="flex flex-col gap-6">
      <ProfilePageHeader />
      <section className="p-4 space-y-2 bg-white rounded-md">
        <ProfileDetails />
      </section>
    </section>
  );
}
