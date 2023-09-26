import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/assets/images/acadx-logo.png';
import { ForgetPasswordForm } from '../../../lib/components/auth/ForgetPasswordForm';

export default async function Page() {



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
          <span className=" inter text-3xl font-semibold">
            Forget Password
          </span>
        </div>

        <p className="text-base font-medium text-gray-800">
          Enter email to recover password
        </p>

        <ForgetPasswordForm />

        <Link
          href="/signin"
          className="mt-3 h-[48px] w-full rounded-md border-2 border-gray-300 bg-transparent px-[14px] py-[8px] text-center  text-sm font-semibold text-primary hover:bg-primary hover:text-white"
        >
          Back to Login
        </Link>
        <footer className="inter mt-14 text-center text-base font-normal text-gray-700">
          &copy; acadx 2023
        </footer>
      </section>
    </section>
  );





}