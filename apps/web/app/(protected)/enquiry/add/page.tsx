import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { PageTitle } from '../../../../lib/components/PageTitle';
import { EnquiryPage } from '../components/EnquiryPage';

export default async function page() {
  const session = await getServerSession(authOptions);

  return (
    <section>
      <PageTitle title="Add New Enquiry" />
      <EnquiryPage
        branchId={session.branchId}
        organizationId={session.organizationId}
      />
    </section>
  );
}
