import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { SignInForm } from '../../../lib/components/auth/SignInForm';
import logo from '../../../public/assets/images/acadx-logo.png';

export const metadata = {
  title: 'acadx.io | Sign in',
  description:
    'A one-stop platform to streamline every aspect of education management.',
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

      <section className="flex h-full w-full translate-y-0 transform flex-col justify-between overflow-auto p-12 opacity-100 transition-all duration-500 ease-in-out md:w-4/12">
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
          Don&apos;t have an account?
        </p>
        <Link
          href="/signup"
          className="mt-3 h-[48px] w-full rounded-md border-2 border-gray-300 bg-transparent px-[14px] py-[8px] text-center text-sm font-semibold text-primary hover:bg-primary hover:text-white"
        >
          Signup
        </Link>
        <footer className="mt-14 text-center text-base font-normal text-gray-700">
          &copy; acadx 2023
        </footer>
      </section>
    </section>
  );
}
