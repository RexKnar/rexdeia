import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../lib/auth';
import {
  dashboardPathForRole,
  resolveDashboardRole,
} from '../lib/auth/resolveDashboardRole';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }

  const role = await resolveDashboardRole(session);
  redirect(dashboardPathForRole(role));
}
