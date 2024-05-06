import { PageTitle } from '@/components/PageTitle';

import { StudentDetail } from './_components/StudentDetail';

export default async function Page() {
  return (
    <section>
      <PageTitle title="Student Details" className="mb-3" />
      <StudentDetail />
    </section>
  );
}
