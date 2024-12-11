'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

import { AddRangeScaleFlyout } from '../_modals/AddRangeScaleModel';

export function RangeScaleHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Range Scales" />
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isRangeScaleFlyoutOpen', 'true');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          Add New Scale
        </Button>
      </section>
      <AddRangeScaleFlyout />
    </>
  );
}
