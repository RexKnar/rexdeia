import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';
import { Text } from 'ui';

import { SignInForm } from '@/components/auth/SignInForm';
import { Footer } from '@/components/Footer';

import { authOptions } from '../../../lib/auth';
import logo from '../../../public/assets/images/rexdeia-logo.png';

export const metadata = {
  title: 'Rexdeia | Sign in',
  description:
    'A one-stop platform to streamline every aspect of education management.',
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/');
  }

  return (
    <section className="flex h-screen flex-col  overflow-x-hidden sm:flex-row">
      <section
        className=" ml-52 mt-10 h-5/6 w-2/5 rounded-2xl  px-12 py-36"
        style={{
          backgroundImage: 'url(/assets/images/signin-banner.png)',
        }}
      >
        <h1>Simplify. Streamline. Succeed.</h1>
        <p>
          From attendance to assessments, our school management system makes it
          easy to handle it all—so you can focus on what truly matters: student
          success.
        </p>
      </section>
      <section className="flex h-screen translate-y-0 transform flex-col overflow-x-hidden  opacity-100 transition-all duration-500 ease-in-out sm:w-2/3 md:w-1/2 md:justify-between lg:w-1/2 xl:w-1/3 xl:justify-between 2xl:justify-center">
        <div>
          <Image src={logo} className="pt-10" alt={'logo'} width={100}></Image>
          <div className="mt-[2rem]">
            <Text variant="xl-bold" className="">
              Log in to Your Account
            </Text>
            <Text variant="sm-regular" className="text-gray-800">
              Welcome back! Select method to log in:
            </Text>
            <Suspense>
              <SignInForm />
            </Suspense>
            <Text
              variant="sm-semibold"
              className="mt-12 text-center  text-gray-800"
            >
              Don&apos;t have an account?
              <Link href="#" className="text-blue-600 ">
                Create an account
              </Link>
            </Text>
          </div>
          <div className="pt-16">
            <Footer />
          </div>
        </div>
      </section>
    </section>
  );
}
