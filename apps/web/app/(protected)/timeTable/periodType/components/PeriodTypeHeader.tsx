'use client';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

const SavePeriodTypeFlyout = dynamic(() =>
  import('../modal/AddPeriodTypeFlyout').then((mod) => mod.SavePeriodTypeFlyout)
);

export function PeriodTypePageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Period Type" />
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isPeriodTypeFlyoutOpen', 'true');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          Add Period Type
        </Button>
      </section>
      <SavePeriodTypeFlyout />
    </>
  );
}
