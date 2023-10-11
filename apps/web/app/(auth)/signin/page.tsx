import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { SignInForm } from '../../../lib/components/auth/SignInForm';
import { Footer } from '../../../lib/components/Footer';
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
    <section className="flex h-screen flex-col overflow-x-hidden sm:flex-row">
      <section
        className=" flex-grow bg-cover bg-center bg-no-repeat md:flex lg:w-1/2 xl:w-2/3"
        style={{
          backgroundImage: 'url(/assets/images/signin-banner.png)',
        }}
      ></section>

      <section
        className="  h-screen w-full translate-y-0 transform flex-col justify-between overflow-x-hidden px-20 opacity-100 transition-all
       duration-500 ease-in-out sm:w-2/3 md:w-1/2 md:justify-center lg:w-1/2 xl:w-1/3"
      >
        <div>
          <Image src={logo} className="pt-10" alt={'logo'} width={100}></Image>
          <span className="text-xl font-semibold">Welcome</span>
          <p className="text-sm font-normal text-gray-800">
            Sign in to your account to get started.
          </p>
        </div>
        <SignInForm />
        <p className="mt-8 text-center text-sm font-semibold text-gray-800">
          Didn&apos;t have an account?
        </p>
        <Link
          href="/signup"
          className="mt-3 w-full rounded-md border-2 border-gray-300 bg-transparent p-2 text-center text-sm font-semibold text-primary hover:bg-primary hover:text-white"
        >
          Signup
        </Link>
        <Footer />
      </section>
    </section>
  );
}
