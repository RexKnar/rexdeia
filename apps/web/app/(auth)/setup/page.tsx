import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import { SetupForm } from '../../../lib/components/auth/SetupForm';
import { getOrganisationsByUserId } from '../../api/user/organization/service';

export const metadata = {
  title: 'Capeo | Setup',
  description: 'Start managing your business with Capeo.',
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }

  const userOrganizations = await getOrganisationsByUserId(session.user.id);
  if (userOrganizations.length) {
    redirect('/');
  }

  return (
    <div className="flex h-screen flex-col sm:flex-row">
      <section
        className="bg-primary hidden flex-grow bg-center bg-no-repeat sm:flex sm:w-auto"
        style={{
          backgroundImage: 'url(/assets/images/sign-in-banner.png)',
        }}
      ></section>

      <section className="flex h-screen w-full translate-y-0 transform flex-col justify-center px-8 opacity-100 transition-all duration-500 ease-in-out md:w-4/12">
        <div className="flex">
          <span className="text-primary text-3xl font-semibold">Setup</span>
        </div>

        <p className="text-gray-600">
          Begin your journey by setting up your account
        </p>

        <SetupForm />
      </section>
    </div>
  );
}
