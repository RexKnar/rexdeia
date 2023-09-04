'use client';

import { startTransition } from 'react';
import { useEffect, useState } from 'react';
import { ONBOARD_ACCOUNT } from '../../endpoints';
import { makeAPICall } from '../../api';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import logo from '../../../public/assets/images/acadx-logo.png';
import lodingPlane from '../../../public/assets/images/loading-paperplane.png';
export function Onboarding() {
  const [isErrored, setIsErrored] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    startTransition(() => {
      makeAPICall(ONBOARD_ACCOUNT, {})
        .then(() => {
          setTimeout(() => {
            setIsOnboarded(true);
          }, 5000);
        })
        .catch(() => {
          setIsErrored(true);
        });
    });
  }, []);

  useEffect(() => {
    if (isOnboarded) {
      router.push('/');
    }
  }, [isOnboarded, router]);

  if (isErrored) {
    return <>Error</>;
  }

  return (
    <>
<<<<<<< HEAD
      <div className="flex h-full flex-col sm:flex-row">
        <section
          className="hidden flex-grow  bg-left bg-no-repeat sm:flex sm:w-1/5"
          style={{
            backgroundImage: 'url(/assets/images/onborarding-side-banner.png)',
            backgroundSize: 'contain',
          }}
        ></section>

        <section className="flex h-screen w-full translate-y-0 transform flex-col  p-8 opacity-100 transition-all duration-500 ease-in-out sm:w-4/5 md:w-4/5">
          <div className="mt-3 flex justify-center">
            <Image src={logo} alt={'logo'} width={150}></Image>
=======
      <section
        className="bg-primary hidden flex-grow bg-repeat sm:flex sm:w-auto"
        style={{
          backgroundImage: 'url(/assets/images/sign-in-banner.png)',
        }}
      >
        <div className="flex h-[100vh] w-[100vw] items-center justify-center">
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="mr-2 h-10 w-10 animate-spin text-white" />
            <h1 className="text-3xl text-white">
              Just a moment, we're getting things ready for you...
            </h1>
>>>>>>> ca1dad6e40b4e33983bcc7dec34d93015ee100bf
          </div>
          <div className="mt-36 flex justify-center">
            <Image
              className="flying-plane"
              src={lodingPlane}
              alt={'logo'}
              width={400}
            ></Image>
          </div>
          <div className="mt-1 justify-center">
            <div className="inter justify-center mt-2 flex text-sm font-semibold">
              <div className="flex items-center">
                <p className="mr-5">
                  <Check />
                  Domain created
                </p>
              </div>
              <div className="flex items-center">
                <p className="mr-5">
                  <Check />
                  Configuration done
                </p>
              </div>
              <div className="flex items-center">
                <p>
                  <Check />
                  Initialisation setup
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
