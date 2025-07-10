'use client';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

import { AddStaffInClassLevelFlyout } from '../_modal/AddStaffInClassLevelFlyout';

const SaveClassLevelFlyout = dynamic(() =>
  import('../_modal/SaveClassLevelFlyout').then(
    (mod) => mod.SaveClassLevelFlyout
  )
);

export function ClassLevelPageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Class Level" />
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isClassLevelFlyoutOpen', 'true');
            router.replace(pathname + '?' + params.toString());
          }}
        >
          Add Class Level
        </Button>
      </section>
      <SaveClassLevelFlyout />
      <AddStaffInClassLevelFlyout />
    </>
  );
}
