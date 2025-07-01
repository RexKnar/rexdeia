import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Text,
} from 'ui';

import { NewSignInForm } from '@/components/auth/NewSignUp';
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
    <section className="  h-full  w-full  bg-white px-6 py-10 sm:px-20 md:bg-gray-600   ">
      <div className="mx-auto my-auto flex flex-row">
        <div className="w-full rounded-2xl border border-gray-500 bg-white  px-6 sm:w-5/6  sm:px-12 md:w-full md:rounded-tl-2xl  md:px-16   lg:w-1/2 lg:rounded-bl-2xl lg:rounded-br-none lg:rounded-tr-none  lg:px-20 xl:px-28   ">
          <div>
            <Image
              src={logo}
              className="pt-12 "
              alt={'logo'}
              width={100}
            ></Image>
            <div className="mt-[2rem]">
              <Text variant="xl-bold">Welcome</Text>
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
        <div className=" hidden w-3/6 rounded-br-2xl rounded-tr-2xl bg-primary xl:block  ">
          <Carousel>
            <CarouselContent>
              <CarouselItem>
                <div
                  className="h-[400px] rounded-tr-2xl  bg-cover"
                  style={{
                    backgroundImage: 'url(/assets/images/signin-banner.png)',
                  }}
                />

                <h1 className="py-5 text-center font-bold text-white">
                  Simplify. Streamline. Succeed.
                </h1>
                <p className="  px-5 py-2 font-light text-white">
                  From attendance to assessments, our school management system
                  makes it easy to handle it all—so you can focus on what truly
                  matters: student success.
                </p>
              </CarouselItem>
              <CarouselItem>
                <div
                  className="h-[400px] rounded-tr-2xl  bg-cover"
                  style={{
                    backgroundImage: 'url(/assets/images/signin-banner.png)',
                  }}
                />
                <h1 className="py-5 text-center font-bold text-white">
                  Simplify. Streamline. Succeed.
                </h1>
                <p className="  px-5 py-2 font-light text-white">
                  From attendance to assessments, our school management system
                  makes it easy to handle it all—so you can focus on what truly
                  matters: student success.
                </p>
              </CarouselItem>
              <CarouselItem>
                <div
                  className="h-[400px] rounded-tr-2xl  bg-cover"
                  style={{
                    backgroundImage: 'url(/assets/images/signin-banner.png)',
                  }}
                />
                <h1 className="py-5 text-center font-bold text-white">
                  Simplify. Streamline. Succeed.
                </h1>
                <p className="  px-5 py-2 font-light text-white">
                  From attendance to assessments, our school management system
                  makes it easy to handle it all—so you can focus on what truly
                  matters: student success.
                </p>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-5 h-6 w-6 -translate-x-1 rounded-full p-0   hover:bg-white " />
            <CarouselNext className="right-5 h-6 w-6  translate-x-1 rounded-full  p-0  hover:bg-white " />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
