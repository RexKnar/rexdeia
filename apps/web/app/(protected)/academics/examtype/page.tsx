import { ExamTypeListTable } from './_components/ExamsTypesTable';
import { ExamTypePageHeader } from './_components/ExamTypePageHeader';

export default async function Page() {
  return (
    <section className="flex flex-col gap-6">
      <ExamTypePageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <ExamTypeListTable />
      </section>
    </section>
  );
}
