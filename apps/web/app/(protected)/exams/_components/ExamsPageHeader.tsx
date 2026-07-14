'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

import { SaveExamFlyout } from '../add/saveExamFlyout';
import { CopyExamModal } from './CopyExamModal';

export function ExamsPageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Exam List" />
        <div className="flex items-center gap-3">
          <CopyExamModal />
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
        </div>
      </section>
      <SaveExamFlyout />
    </>
  );
}
