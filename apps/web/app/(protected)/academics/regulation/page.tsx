import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { PageHeader } from '../../../../lib/components/PageHeader';
import { RegulationListTable } from './components/RegulationListTable';
import { PathBreadcrumb } from '../../../../lib/components/PathBreadcrumb';
import { RegulationShareFlyout } from './components/RegulationShareFlyout';
import { RegulationFilterOptions } from './components/RegulationFilterOptions';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/regulation');
  }

  return (
    <section className="h-full w-full bg-gray-50 px-7 py-12">
      <div className="flex justify-between">
        <div>
          <PathBreadcrumb />
          <PageHeader title="Regulation Management" />
        </div>
        <div>
          <RegulationShareFlyout></RegulationShareFlyout>
        </div>
      </div>

      <div>
        <div className="mt-4 rounded-md bg-white p-3">
          <RegulationFilterOptions></RegulationFilterOptions>
          <RegulationListTable></RegulationListTable>
        </div>
      </div>
    </section>
  );
}
