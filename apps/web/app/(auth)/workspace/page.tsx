import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { Workspace } from '../../../lib/components/auth/Workspace';
import { getOrganisationsByUserId } from '../../api/user/organization/service';

export const metadata = {
  title: 'acadx.io | Workspace Selector',
  description:
    'Your step to streamline every aspect of education management starts here.',
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }

  const userOrganizations = await getOrganisationsByUserId(session.user.id);

  //TODO: Handle when user is part of multiple organizations/ branches
  return userOrganizations.length === 1 ? (
    <Workspace
      branchId={userOrganizations[0].branchId}
      organizationId={userOrganizations[0].organizationId}
    />
  ) : null;
}
