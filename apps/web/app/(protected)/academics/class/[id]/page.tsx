import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import { ClassDetail } from './_components/ClassDetail';
import { SaveSectionFlyout } from './section/[sectionId]/_components/SaveSectionFlyout';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signIn?callbackUrl=/admission/add');
  }

  return (
    <section className="mx-auto my-5 rounded-md bg-white p-6">
      <ClassDetail />
      <SaveSectionFlyout />
    </section>
  );
}
