'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

export function RegulationsPageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Regulations" />
      <Button
        variant="default"
        onClick={async () => {
          const params = new URLSearchParams(searchParams);
          params.set('isFlyoutOpen', 'true');

          router.replace(pathname + '?' + params.toString());
        }}
      >
        Add Regulation
      </Button>
    </section>
  );
}
