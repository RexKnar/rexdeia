'use client';

import { PageTitle } from '@/components/PageTitle';

export function PageHeader() {
  return (
    <section className="flex items-center justify-between px-2">
      <PageTitle title="Configure Exam" />
    </section>
  );
}
