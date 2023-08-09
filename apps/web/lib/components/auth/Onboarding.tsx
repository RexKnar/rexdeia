'use client';

import { startTransition } from 'react';
import { useEffect, useState } from 'react';
import { ONBOARD_ACCOUNT } from '../../endpoints';
import { makeAPICall } from '../../api';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
  }, [isOnboarded]);

  if (isErrored) {
    return <>Error</>;
  }

  return (
    <>
      <section
        className="bg-primary hidden flex-grow bg-repeat sm:flex sm:w-auto"
        style={{
          backgroundImage: 'url(/assets/images/sign-in-banner.png)',
        }}
      >
        <div className="flex h-[100vh] w-[100vw] items-center justify-center">
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="mr-2 h-10 w-10 animate-spin text-white" />
            <h1 className="lato-light text-3xl text-white">
              Just a moment, we're getting things ready for you...
            </h1>
          </div>
        </div>
      </section>
    </>
  );
}
