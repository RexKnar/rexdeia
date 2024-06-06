'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

import { SaveExamFlyout } from '../add/saveExamFlyout';

export function ExamsPageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Exam List" />
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isSaveExamFlyoutOpen', 'true');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          Add Exam
        </Button>
      </section>
      <SaveExamFlyout />
    </>
  );
}
