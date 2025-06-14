'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { LinkButton } from '@/components/LinkButton';
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
        <div className="flex gap-2">
          <LinkButton
            variant="outline"
            url={`/academics/range-scales/rangescales`}
            className="h-auto border-gray-700 px-3 py-2"
          >
            {' '}
            Load Scale
          </LinkButton>
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
        </div>
      </section>
      <AddRangeScaleFlyout />
    </>
  );
}
