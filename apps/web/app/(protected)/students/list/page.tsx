import { StudentsList } from './components/StudentsList';
import { PageHeader } from '../../../../lib/components/PageHeader';
import { PathBreadcrumb } from '../../../../lib/components/PathBreadcrumb';

export default async function Page() {
  return (
    <section className="w-full bg-gray-50 p-3">
      <section>
        <section className="mx-6 mt-8 flex items-center justify-between">
          <PathBreadcrumb />
        </section>
        <section className="mx-auto my-5 rounded-md bg-white p-6">
          <PageHeader title="Students List" className="mb-3" />
          <StudentsList />
        </section>
      </section>
    </section>
  );
}
