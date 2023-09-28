import Image from 'next/image';

import { ResetPasswordForm } from '../../../lib/components/auth/ResetPasswordForm';
import logo from '../../../public/assets/images/acadx-logo.png';

export default async function Page() {
  return (
    <section className="flex h-full flex-col justify-center sm:flex-row">
      <section className="flex h-full w-full translate-y-0 transform flex-col justify-between overflow-auto px-20 opacity-100 transition-all duration-500 ease-in-out md:w-4/12 ">
        <div className="flex justify-center">
          <Image src={logo} className="pt-10 " alt={'logo'} width={100}></Image>
        </div>
        <ResetPasswordForm />
        <footer className="mt-14 text-center text-sm font-normal text-gray-700">
          &copy; acadx 2023
        </footer>
      </section>
    </section>
  );
}
