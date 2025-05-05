import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { Workspace } from '@/components/auth/Workspace';

import { authOptions } from '../../../lib/auth';
import { getOrganisationsByUserId } from '../../api/user/organization/service';

export const metadata = {
  title: 'Rexdeia | Workspace Selector',
  description:
    'Your step to streamline every aspect of education management starts here.',
};

export default async function Page() {
  const allCookies = cookies(); // returns a ReadonlyRequestCookies instance

  // Get all cookies as array
  const cookieArray = allCookies.getAll();

  // Or get a specific one
  const sessionToken = allCookies.get('next-auth.session-token')?.value;

  console.log('🍪 Server cookies:', cookieArray);
  console.log('🍪 Session token:', sessionToken);
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
      organizationName={userOrganizations[0].organization.name}
      institute={userOrganizations[0].organization.institute}
    />
  ) : null;
}
