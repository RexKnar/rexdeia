'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

import { AssignLearnerFlyout } from '../_modals/AssignLearnerFlyout';

export function LearnerListHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Learners List" className="mb-3" />
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isAssignLearnerFlyoutOpen', 'true');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          Add New Learner
        </Button>
      </section>
      <AssignLearnerFlyout />
    </>
  );
}
