import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { RegulationList } from '../../../../lib/components/regulation/regulationList';
import { getRegulationList } from '../../../api/regulation/service';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/regulation');
  }
  try {
    const apiResponse = await getRegulationList({
      branchId: session.branchId,
      organizationId: session.organizationId,
    });
    return (
      <div className="flex flex-col">
        <RegulationList regulationList={apiResponse} />
      </div>
    );
  } catch (error) {
    console.log(error);
  }
}
