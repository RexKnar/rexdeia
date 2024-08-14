'use client';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

export function ClassLevelPageHeader() {
  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Class Level" />
      <Button variant="default">Add Class Level</Button>
    </section>
  );
}
