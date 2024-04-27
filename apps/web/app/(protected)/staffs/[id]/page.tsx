import { PageTitle } from '@/components/PageTitle';

import { StaffDetail } from './components/Staffdetail';

export default async function Page() {
  return (
    <section>
      <div className="mx-auto  my-5">
        <PageTitle title="Staff Details" className=" mb-4  pl-2" />
        <StaffDetail />
      </div>
    </section>
  );
}
