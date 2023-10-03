import Image from 'next/image';

import { ResetPasswordForm } from '../../../lib/components/auth/ResetPasswordForm';
import logo from '../../../public/assets/images/acadx-logo.png';

export default async function Page() {
  return (
    <section className="flex h-full flex-col justify-center sm:flex-row">
      <section
        className="hidden flex-grow bg-cover bg-left bg-no-repeat sm:flex sm:w-1/2"
        style={{
          backgroundImage: 'url(/assets/images/forgot-password-banner-1.png)',
          opacity: 0.2,
        }}
      ></section>
      <section className="mt-2 flex h-full w-full translate-y-0 transform flex-col justify-between overflow-auto px-20 opacity-100 transition-all duration-500 ease-in-out md:w-1/2 ">
        <div className="flex justify-center">
          <Image src={logo} className="pt-10 " alt={'logo'} width={100}></Image>
        </div>
        <ResetPasswordForm />
        <footer className="mt-16 text-center text-sm font-normal text-gray-700">
          <div className="mt-14">&copy; acadx 2023</div>
        </footer>
      </section>
      <section
        className="hidden flex-grow bg-cover bg-left bg-no-repeat sm:flex sm:w-1/2"
        style={{
          backgroundImage: 'url(/assets/images/forgot-password-banner-2.png)',
          opacity: 0.4,
        }}
      ></section>
    </section>
  );
}
