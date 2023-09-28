import Image from 'next/image';
import Link from 'next/link';

import { ForgetPasswordForm } from '../../../lib/components/auth/ForgetPasswordForm';
import logo from '../../../public/assets/images/acadx-logo.png';

export default async function Page() {
  return (
    <section className="flex h-full flex-col justify-center sm:flex-row">
      <section className="flex h-full w-full translate-y-0 transform flex-col justify-between overflow-auto px-20 opacity-100 transition-all duration-500 ease-in-out md:w-4/12 ">
        <div className="flex justify-center">
          <Image src={logo} className="pt-10 " alt={'logo'} width={100}></Image>
        </div>
        <div className="mt-10 flex flex-col">
          <span className="mb-4 text-2xl font-semibold">
            Recover Your Account
          </span>
          <p className="text-sm font-normal text-gray-800">
            Select option to verify your account with{' '}
            <span className="text-blue-600">Acadx</span>
          </p>
        </div>
        <ForgetPasswordForm />
        <p className=" mt-4 text-center text-sm font-semibold text-gray-800">
          Don&apos;t receive the link?
        </p>
        <Link
          href="/signin"
          className=" w-full rounded-md border-2 border-gray-300 bg-transparent p-2 text-center text-sm font-semibold text-primary hover:bg-primary hover:text-white"
        >
          Resend
        </Link>
        <footer className="mt-14 text-center text-sm font-normal text-gray-700">
          &copy; acadx 2023
        </footer>
      </section>
    </section>
  );
}
