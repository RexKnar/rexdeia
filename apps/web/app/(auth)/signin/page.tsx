import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import { SignInForm } from '../../../lib/components/auth/SignInForm';
import logo from '../../../public/assets/images/acadx-logo.png';
import Image from 'next/image';
import { Button } from 'ui';

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
    <section className="flex h-full flex-col sm:flex-row">
      <section
        className="hidden flex-grow bg-cover bg-center bg-no-repeat sm:flex sm:w-auto"
        style={{
          backgroundImage: 'url(/assets/images/signin-banner.png)',
        }}
      ></section>

      <section className="flex h-full w-full translate-y-0 transform flex-col justify-between p-12 opacity-100 transition-all duration-500 ease-in-out md:w-4/12">
        <div>
          <Image src={logo} alt={'logo'} width={150}></Image>
        </div>
        <div className="mt-8 flex">
          <span className="text-3xl font-semibold">Welcome</span>
        </div>

        <p className="text-base font-medium text-gray-800">
          Sign in to your account to get started.
        </p>

        <SignInForm />

        <p className="mt-12 text-center text-base font-semibold text-gray-800">
          Don't have an account?
        </p>
        <Button
          type="submit"
          className="text-primary mt-3 w-full bg-transparent bg-transparent outline outline-gray-300 hover:text-white"
        >
          Signup
        </Button>
        <p className="mt-14 text-center text-base font-normal text-gray-700">
          &copy; acadx 2023
        </p>
      </section>
    </section>
  );
}
