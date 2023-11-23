import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { RegulationList } from '../../../../lib/components/regulation/regulationList';
import { getRegulationList } from '../../../api/regulation/service';
import { PageHeader } from '../../../../lib/components/PageHeader';
import { PathBreadcrumb } from '../../../../lib/components/PathBreadcrumb';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/regulation');
  }
  try {
    const apiResponse = await getRegulationList({
      branchId: session.branchId,
    });
    return (
      <section className="flex h-full w-full flex-col gap-[20px] bg-gray-50 px-[25px] py-[40px] sm:px-[50px]">
        <PathBreadcrumb />
        <PageHeader title="Regulation Management" />
        <RegulationList regulationList={apiResponse} />
      </section>
    );
  } catch (error) {
    console.log(error);
  }
}
