import { PageTitle } from '../../../../lib/components/PageTitle';
import { StaffDetail } from './components/Staffdetail';

export default async function Page() {
  return (
    <section>
      <PageTitle title="Staff Details" className="mb-3" />
      <StaffDetail />
    </section>
  );
}
