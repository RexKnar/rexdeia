'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

import { AddPeriodMasterFlyout } from '../modal/AddPeriodMasterFlyout';

export default function PeriodMasterPageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Period Master" />
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isPeriodMasterFlyoutOpen', 'true');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          Add Period Master
        </Button>
      </section>
      <AddPeriodMasterFlyout />
    </>
  );
}
