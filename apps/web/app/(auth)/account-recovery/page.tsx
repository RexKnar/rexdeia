import Image from 'next/image';
import { Suspense } from 'react';

import { RecoveryPasswordForm } from '../../../lib/components/auth/RecoveryPasswordForm';
import logo from '../../../public/assets/images/acadx-logo.png';

export default async function Page() {
  return (
    <section className="flex h-full flex-col justify-center sm:flex-row">
      <section
        className="flex-grow bg-cover bg-left bg-no-repeat sm:flex sm:w-1/4"
        style={{
          backgroundImage: 'url(/assets/images/forgot-password-banner-1.png)',
          opacity: 0.2,
        }}
      ></section>
      <section className="flex h-full translate-y-0 transform flex-col justify-between overflow-auto px-20 transition-all duration-500 ease-in-out sm:w-full md:w-4/5 lg:w-3/5 xl:w-2/5">
        <div className="flex justify-center">
          <Image src={logo} className="pt-10" alt={'logo'} width={100}></Image>
        </div>
        <Suspense>
          <RecoveryPasswordForm />
        </Suspense>
      </section>
      <section
        className="flex-grow bg-cover bg-left bg-no-repeat sm:flex sm:w-1/4"
        style={{
          backgroundImage: 'url(/assets/images/forgot-password-banner-2.png)',
          opacity: 0.2,
        }}
      ></section>
    </section>
  );
}
