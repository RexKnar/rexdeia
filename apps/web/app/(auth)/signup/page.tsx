import { SignUpForm } from '../../../lib/components/auth/SignUpForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Capeo | Sign up',
  description: 'Start managing your business with Capeo.',
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) {
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
          <span className="text-primary text-3xl font-semibold">
            Create Account
          </span>
        </div>

        <p className="text-gray-600">
          Sign up to start managing your business.
        </p>

        <SignUpForm />
      </section>
    </div>
  );
}
