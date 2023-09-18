import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../lib/auth';
import { Onboarding } from '../../lib/components/auth/Onboarding';

export default async function Page({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.branchId || !session.organizationId) {
    redirect('/signin');
  }

  const selectedBranchId = session.branchId;
  const selectedOrganizationId = session.organizationId;

  const branchesToSetup = session.user.createdBranches.filter(
    (branch) => branch.id === selectedBranchId
  );

  if (branchesToSetup?.length) {
    return (
      <Onboarding
        branchId={selectedBranchId}
        organizationId={selectedOrganizationId}
      />
    );
  }

  // TODO: Add a page to select the branch to setup
  return redirect('/');
}
