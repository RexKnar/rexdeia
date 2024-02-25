import { getServerSession } from 'next-auth';

import { PageTitle } from '@/components/PageTitle';

import { authOptions } from '../../../../lib/auth';
import { EnquiryPage } from '../_components/EnquiryPage';

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
