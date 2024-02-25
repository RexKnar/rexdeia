'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

export function GroupPageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Group" />
      <Button
        variant="default"
        onClick={async () => {
          const params = new URLSearchParams(searchParams);
          params.set('isGroupFlyoutOpen', 'true');

          router.replace(pathname + '?' + params.toString());
        }}
      >
        Add Group
      </Button>
    </section>
  );
}
