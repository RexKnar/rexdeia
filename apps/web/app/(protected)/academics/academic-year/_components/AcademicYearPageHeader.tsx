'use client';

import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';
import { useQueryParams } from '@/hooks/useQueryParams';

export function AcademicYearPageHeader() {
  const { setParams } = useQueryParams();

  return (
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
  );
}
