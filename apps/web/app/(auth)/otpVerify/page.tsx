import Image from 'next/image';
import Link from 'next/link';

import { OtpVerifyForm } from '../../../lib/components/auth/OtpVerifyForm';
import logo from '../../../public/assets/images/acadx-logo.png';

export default async function Page() {
  return (
    <section className="flex h-full flex-col justify-center sm:flex-row">
      <section
        className="hidden flex-grow bg-cover bg-left bg-no-repeat sm:flex sm:w-1/4"
        style={{
          backgroundImage: 'url(/assets/images/forgot-password-banner-1.png)',
          opacity: 0.2,
        }}
      ></section>
      <section className="flex h-full w-full translate-y-0 transform flex-col justify-between overflow-auto px-20 transition-all duration-500 ease-in-out md:w-auto">
        <div className="flex justify-center">
          <Image src={logo} className="pt-10 " alt={'logo'} width={100}></Image>
        </div>
        <OtpVerifyForm />
        <p className=" mt-16 text-center text-sm font-semibold text-gray-800">
          Don&apos;t receive the OTP?
        </p>
        <Link
          href="/signin"
          className="mt-6 w-full rounded-md border-2 border-gray-300 bg-transparent p-2 text-center text-sm font-semibold text-primary hover:bg-primary hover:text-white"
        >
          Resend code
        </Link>
        <footer className="mt-16 text-center text-sm font-normal text-gray-700">
          <div>&copy; acadx 2023</div>
        </footer>
      </section>
      <section
        className="hidden flex-grow bg-cover bg-left bg-no-repeat sm:flex sm:w-1/4"
        style={{
          backgroundImage: 'url(/assets/images/forgot-password-banner-2.png)',
          opacity: 0.4,
        }}
      ></section>
    </section>
  );
}
