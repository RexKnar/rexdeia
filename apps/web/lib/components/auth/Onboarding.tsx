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
          setIsOnboarded(true);
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
            <div className="inter mt-2 flex justify-center text-sm font-semibold">
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
