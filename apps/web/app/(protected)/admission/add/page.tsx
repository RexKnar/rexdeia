import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { PageTitle } from '@/components/PageTitle';

import { authOptions } from '../../../../lib/auth';
import { AdmissionPage } from './_components/AdmissionPage';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/admission/add');
  }

  return (
    <section>
      <PageTitle title="Add New Admission" />

      <AdmissionPage
        branchId={session.branchId}
        organizationId={session.organizationId}
      />
    </section>
  );
}
