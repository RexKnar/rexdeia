'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '../../../../../lib/components/PageTitle';

export function CategoryPageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Category" />
      <Button
        variant="default"
        onClick={async () => {
          const params = new URLSearchParams(searchParams);
          params.set('isCategoryFlyoutOpen', 'true');

          router.replace(pathname + '?' + params.toString());
        }}
      >
        Add Category
      </Button>
    </section>
  );
}
