import { StudentListBreadcrumb } from './components/StudentListBreadcrumb';
import { StudentsList } from './components/StudentsList';
import { PageHeader } from '../../../../lib/components/PageHeader';

export default async function Page() {
  return (
    <section className="w-full bg-gray-50 p-3">
      <section>
        <section className="mx-6 mt-8 flex items-center justify-between">
          <StudentListBreadcrumb />
        </section>
        <section className="mx-auto my-5 rounded-md bg-white p-6">
          <PageHeader title="Students List" className="mb-3" />
          <StudentsList />
        </section>
      </section>
    </section>
  );
}
