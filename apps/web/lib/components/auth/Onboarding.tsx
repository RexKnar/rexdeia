'use client';

import { useEffect, useState } from 'react';
import { ONBOARD_ACCOUNT } from '../../endpoints';
import { makeAPICall } from '../../api';
import { useRouter } from 'next/navigation';

export function Onboarding() {
  debugger;
  const [isErrored, setIsErrored] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function onBoardAccount() {
      try {
        debugger;
        await makeAPICall(ONBOARD_ACCOUNT, {});
        debugger;
        setIsOnboarded(true);
      } catch (error) {
        console.error(error);
        setIsErrored(true);
      }
    }

    onBoardAccount();
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
