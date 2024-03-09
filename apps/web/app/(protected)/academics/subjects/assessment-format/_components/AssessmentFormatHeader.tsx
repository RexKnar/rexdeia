'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

const SaveAssessmentFormatFlyout = dynamic(() =>
  import('./_modals/SaveAssessmentFormatFlyout').then(
    (mod) => mod.SaveAssessmentFormatFlyout
  )
);

export function AssessmentFormatHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Assessment Format" />
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isAssessmentFormatFlyoutOpen', 'true');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          Add Assessment Format
        </Button>
      </section>
      <SaveAssessmentFormatFlyout />
    </>
  );
}
