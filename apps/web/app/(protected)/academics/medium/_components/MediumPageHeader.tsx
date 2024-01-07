'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from 'ui';

import { PageTitle } from '../../../../../lib/components/PageTitle';

export function MediumPageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Medium" />
      <Button
        variant="default"
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.set('isMediumFlyoutOpen', 'true');
          router.push(pathname + '?' + params.toString());
        }}
      >
        Add Medium
      </Button>
    </section>
  );
}
