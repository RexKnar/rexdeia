'use client';

import { startTransition } from 'react';
import { useEffect, useState } from 'react';
import { ONBOARD_ACCOUNT } from '../../endpoints';
import { makeAPICall } from '../../api';
import { useRouter } from 'next/navigation';

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

  return <>Onboarding User</>;
}
