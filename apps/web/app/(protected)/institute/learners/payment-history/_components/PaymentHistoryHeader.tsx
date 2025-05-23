'use client';

import { PageTitle } from '@/components/PageTitle';

export function PaymentHistoryHeader() {
  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Payment History" className="mb-3" />
    </section>
  );
}
