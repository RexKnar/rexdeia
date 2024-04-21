'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

const SaveSubjectMasterFlyout = dynamic(() =>
  import('../_modals/SaveSubjectMasterFlyout').then(
    (mod) => mod.SaveSubjectMasterFlyout
  )
);

export function SubjectMasterPageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Subject Master" />
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isSubjectMasterFlyoutOpen', 'true');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          Add Subject Master
        </Button>
      </section>
      <SaveSubjectMasterFlyout />
    </>
  );
}
