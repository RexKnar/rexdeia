import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import { RegulationForm } from '../../../../../lib/components/regulation/regulationForm';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/regulation/new');
  }
  return (
    <RegulationForm
      branchId={session.branchId}
      organizationId={session.organizationId}
    />
  );
}
