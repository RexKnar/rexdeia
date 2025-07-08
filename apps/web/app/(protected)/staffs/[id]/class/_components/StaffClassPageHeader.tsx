'use client';
import { PageTitle } from '@/components/PageTitle';

export function StaffClassPageHeader() {
  return (
    <section className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="text-xl font-semibold text-gray-800">
        <PageTitle title="Class List" />
      </div>
    </section>
  );
}
