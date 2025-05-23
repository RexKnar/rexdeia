'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

export function RoadmapPageHeader() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Roadmap" />
      <Button variant="default" onClick={handleGoBack}>
        Back
      </Button>
    </section>
  );
}
