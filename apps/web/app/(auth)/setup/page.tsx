import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import { SetupForm } from '../../../lib/components/auth/SetupForm';
import { getOrganisationsByUserId } from '../../api/user/organization/service';
import Image from 'next/image';
import logo from '../../../public/assets/images/acadx-logo.png';
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
        className="bg-primary hidden flex-grow  bg-left bg-no-repeat sm:flex sm:w-1/4"
        style={{
          backgroundImage: 'url(/assets/images/online-communication1.png)',
          backgroundSize: 'cover',
        }}
      ></section>

      <section className="flex h-screen w-full translate-y-0 transform flex-col  p-8 opacity-100 transition-all duration-500 ease-in-out sm:w-3/4 md:w-3/4">
        <div className="mt-3 flex justify-center">
          <Image src={logo} alt={'logo'} width={150}></Image>
        </div>
        <div className="mt-36 flex justify-center">
          <p className="inter text-2xl font-semibold">
            Please select the type of account you are creating.
          </p>
        </div>
        <div className="mt-1 flex justify-center">
          <SetupForm />
        </div>
      </section>
    </div>
  );
}
