import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Text } from 'ui';

import { authOptions } from '../../../lib/auth';
import { SignUpForm } from '../../../lib/components/auth/SignUpForm';
import { Footer } from '../../../lib/components/Footer';
import logo from '../../../public/assets/images/acadx-logo.png';

export const metadata = {
  title: 'acadx.io | Sign up',
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
        className="hidden flex-grow bg-cover bg-center bg-no-repeat  md:flex lg:w-1/2 xl:w-2/3"
        style={{
          backgroundImage: 'url(/assets/images/signin-banner.png)',
        }}
      ></section>
      <section className=" flex h-full overflow-x-hidden px-[3rem] transition-all duration-500 ease-in-out sm:w-2/3 md:w-1/2 md:justify-center lg:w-2/5 xl:w-1/3">
        <div className="   translate-y-0 flex-col ">
          <Image src={logo} className="pt-10" alt={'logo'} width={100}></Image>
          <Text variant="xl-semibold" className="mt-14">
            Create Your Account
          </Text>
          <Text variant="sm-regular" className="text-gray-800">
            Join acadx and embark on a seamless academic experience.
          </Text>

          <SignUpForm />

          <Text
            variant="sm-semibold"
            className="mt-12 text-center text-gray-800"
          >
            Have an account?
          </Text>
          <Link
            href="/signin"
            className="mt-3 h-[48px] w-full rounded-md border-2 border-gray-300 bg-transparent px-[14px] py-[8px] text-center text-sm font-semibold text-primary hover:bg-primary hover:text-white"
          >
            Sign In
          </Link>
          <Footer />
        </div>
      </section>
    </section>
  );
}
