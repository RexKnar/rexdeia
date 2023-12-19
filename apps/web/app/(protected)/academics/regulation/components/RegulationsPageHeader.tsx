'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from 'ui';

import { PageTitle } from '../../../../../lib/components/PageTitle';

export function RegulationsPageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const openFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isFlyoutOpen', 'true');

    router.push(pathname + '?' + params.toString());
  };

  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Regulations" />
      <Button variant="default" onClick={() => openFlyout()}>
        Add Regulation
      </Button>
    </section>
  );
}
