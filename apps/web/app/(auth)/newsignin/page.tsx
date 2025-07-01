import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';
import { Text } from 'ui';

import { Footer } from '@/components/Footer';

import { authOptions } from '../../../lib/auth';
import logo from '../../../public/assets/images/rexdeia-logo.png';

import { SignInForm } from '@/components/auth/SignInForm';
import { NewSignInForm } from '@/components/auth/NewSignUp';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "ui"
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

    <section className="  bg-white  md:bg-gray-600  py-10 h-full w-full px-6 sm:px-20   ">
      <div className='mx-auto my-auto flex-row flex'>
        <div
          className="w-full sm:w-5/6 md:w-full lg:w-1/2 bg-white  md:rounded-tl-2xl lg:rounded-bl-2xl  lg:rounded-tr-none lg:rounded-br-none rounded-2xl  px-6   sm:px-12 md:px-16 lg:px-20 xl:px-28  border border-gray-500   "
        >

          <div>
            <Image src={logo} className="pt-12 " alt={'logo'} width={100}></Image>
            <div className="mt-[2rem]">
              <Text variant="xl-bold">
                Welcome
              </Text>
              <Text variant="sm-regular" className="text-gray-800">
                Sign in to you Account to get started
              </Text>
              <Suspense>
                <NewSignInForm />
              </Suspense>
              <Text
                variant="sm-semibold"
                className="mt-8 text-center  text-gray-800"
              >
                Don&apos;t have an account?

              </Text>
              <Link
                href="/signup"
                className="mt-2 flex w-full justify-center rounded-md border-2 border-gray-300 bg-transparent p-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
              >
                Signup
              </Link>
            </div>
            <div className="pt-16">
              <Footer />
            </div>
          </div>
        </div>
        <div
          className=" w-3/6 rounded-br-2xl rounded-tr-2xl bg-primary xl:block hidden  "


        >

          <Carousel >
            <CarouselContent>
              <CarouselItem >
                <div
                  className="h-[400px] bg-cover  rounded-tr-2xl"
                  style={{
                    backgroundImage: 'url(/assets/images/signin-banner.png)',
                  }}
                />

                <h1 className='text-white text-center font-bold py-5'>Simplify. Streamline. Succeed.</h1>
                <p className='  text-white font-light px-5 py-2'>
                  From attendance to assessments, our school management system makes it
                  easy to handle it all—so you can focus on what truly matters: student
                  success.
                </p>
              </CarouselItem>
              <CarouselItem >
                <div
                  className="h-[400px] bg-cover  rounded-tr-2xl"
                  style={{
                    backgroundImage: 'url(/assets/images/signin-banner.png)',
                  }}
                />
                <h1 className='text-white text-center font-bold py-5'>Simplify. Streamline. Succeed.</h1>
                <p className='  text-white font-light px-5 py-2'>
                  From attendance to assessments, our school management system makes it
                  easy to handle it all—so you can focus on what truly matters: student
                  success.
                </p></CarouselItem>
              <CarouselItem>
                <div
                  className="h-[400px] bg-cover  rounded-tr-2xl"
                  style={{
                    backgroundImage: 'url(/assets/images/signin-banner.png)',
                  }}
                />
                <h1 className='text-white text-center font-bold py-5'>Simplify. Streamline. Succeed.</h1>
                <p className='  text-white font-light px-5 py-2'>
                  From attendance to assessments, our school management system makes it
                  easy to handle it all—so you can focus on what truly matters: student
                  success.
                </p>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className='h-6 w-6 p-0 left-5 -translate-x-1 rounded-full   hover:bg-white ' />
            <CarouselNext className='h-6 w-6 p-0  right-5 translate-x-1  rounded-full  hover:bg-white ' />
          </Carousel>

        </div>
      </div>
    </section >
  );
} 