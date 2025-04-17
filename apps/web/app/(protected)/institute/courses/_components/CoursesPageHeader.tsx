'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

export function CoursesPageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const AddCourseFlyout = dynamic(() =>
    import('../_modals/AddCourseFlyout').then((mod) => mod.AddCourseFlyout)
  );
  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Courses" />
      <Button
        variant="default"
        onClick={async () => {
          const params = new URLSearchParams(searchParams);
          params.set('isAddCourseFlyoutOpen', 'true');

          router.replace(pathname + '?' + params.toString());
        }}
      >
        Create Course
      </Button>
      <AddCourseFlyout />
    </section>
  );
}
