import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import { SignInForm } from '../../../lib/components/auth/SignInForm';

export const metadata = {
  title: 'Capeo | Sign in',
  description: 'Capeo is a business management platform for small businesses.',
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/');
  }

  return (
    <section className="flex h-screen flex-col sm:flex-row">
      <section
        className="bg-primary hidden flex-grow sm:flex sm:w-auto"
        style={{
          backgroundImage: 'url(/assets/images/sign-in-banner.png)',
          backgroundRepeat: 'repeat',
        }}
      ></section>

      <section className="flex h-screen w-full translate-y-0 transform flex-col justify-center px-8 opacity-100 transition-all duration-500 ease-in-out md:w-4/12">
        <div className="flex">
          <span className="text-primary text-3xl font-semibold">Welcome</span>
        </div>

        <p className="text-gray-600">Sign in to your account to get started.</p>

        <SignInForm />

        <p className="mt-4 text-center text-gray-500">
          Don't have an account yet?{' '}
          <Link href="/signup" className="text-primary font-semibold">
            Click here
          </Link>
          {` `} to create one.
        </p>
      </section>
    </section>
  );
}
