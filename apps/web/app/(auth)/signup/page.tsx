import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';
import { Text } from 'ui';

import { SignUpForm } from '@/components/auth/SignUpForm';
import { Footer } from '@/components/Footer';

import { authOptions } from '../../../lib/auth';
import logo from '../../../public/assets/images/rexdeia-logo.png';

export const metadata = {
  title: 'Rexdeia | Sign up',
  description:
    'Your step to streamline every aspect of education management starts here.',
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/');
  }

  return (
    <section className="flex h-screen flex-col overflow-x-hidden sm:flex-row">
      <section
        className="hidden flex-grow bg-cover bg-center bg-no-repeat md:flex lg:w-1/2 xl:w-2/3"
        style={{
          backgroundImage: 'url(/assets/images/signin-banner.png)',
        }}
      ></section>
      <section className="flex h-screen translate-y-0 transform flex-col overflow-x-hidden px-20 opacity-100 transition-all duration-500 ease-in-out sm:w-2/3 md:w-1/2 md:justify-between lg:w-1/2 xl:w-1/3 xl:justify-between 2xl:justify-center">
        <div className="">
          <Image src={logo} className="pt-10" alt={'logo'} width={100}></Image>
          <div className="mt-2">
            <Text variant="xl-semibold" className="mt-14">
              Create Your Account
            </Text>
            <Text variant="sm-regular" className="text-gray-800">
              Join rexdeia and embark on a seamless academic experience.
            </Text>
            <Suspense>
              <SignUpForm />
            </Suspense>
            <Text
              variant="sm-semibold"
              className="mt-12 text-center text-gray-800"
            >
              Have an account?
            </Text>
            <Link
              href="/signin"
              className="mt-3 flex w-full justify-center rounded-md border-2 border-gray-300 bg-transparent p-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
            >
              Sign In
            </Link>
          </div>
          <Footer />
        </div>
      </section>
    </section>
  );
}
