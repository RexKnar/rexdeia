'use client';
import { PageTitle } from '@/components/PageTitle';

export function ProfilePageHeader() {
  return (
    <section className="flex justify-between px-2">
      <PageTitle title="User Profile" />
    </section>
  );
}
