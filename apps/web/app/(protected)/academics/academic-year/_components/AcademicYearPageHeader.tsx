'use client';

import dynamic from 'next/dynamic';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';
import { useQueryParams } from '@/hooks/useQueryParams';

const SaveAcademicYearFlyout = dynamic(() =>
  import('../_components/_modals/SaveAcademicYearFlyout').then(
    (mod) => mod.SaveAcademicYearFlyout
  )
);

export function AcademicYearPageHeader() {
  const { setParams } = useQueryParams();

  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Academic Year" />
        <Button
          variant="default"
          onClick={() => {
            setParams({ isFlyoutOpen: 'true' });
          }}
        >
          Add Academic Year
        </Button>
      </section>
      <SaveAcademicYearFlyout />
    </>
  );
}
