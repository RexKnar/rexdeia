import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';
import { Onboarding } from '../../lib/components/auth/Onboarding';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }

  return <Onboarding />;
}
