'use client';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

const SavePeriodModeFlyout = dynamic(() =>
  import('../modal/AddPeriodModeFlyout').then((mod) => mod.SavePeriodModeFlyout)
);

export function PeriodModePageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Period Mode" />
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isPeriodModeFlyoutOpen', 'true');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          Add Period Mode
        </Button>
      </section>
      <SavePeriodModeFlyout />
    </>
  );
}
