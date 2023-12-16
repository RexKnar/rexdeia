import { PageTitle } from '../../../../lib/components/PageTitle';
import { StudentsList } from './components/StudentsList';

export default async function Page() {
  return (
    <section>
      <div className="mx-auto my-5 rounded-md bg-white p-6">
        <PageTitle title="Students List" className="mb-3" />
        <StudentsList />
      </div>
    </section>
  );
}
