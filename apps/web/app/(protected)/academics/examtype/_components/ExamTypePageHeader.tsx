'use client';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

const SaveExamTypeFlyout = dynamic(() =>
  import('../_modal/SaveExamTypeFlyout').then((mod) => mod.SaveExamTypeFlyout)
);

export function ExamTypePageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Exam Type" />
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isGroupFlyoutOpen', 'true');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          Add Exam Type
        </Button>
      </section>
      <SaveExamTypeFlyout />
    </>
  );
}
