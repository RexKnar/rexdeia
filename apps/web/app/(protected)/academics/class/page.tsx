import { FileText } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { LinkButton } from '../../../../lib/components/LinkButton';
import { PageTitle } from '../../../../lib/components/PageTitle';
import { ClassList } from './_components/ClassList';
import SaveSectionFlyout from './[id]/section/[sectionId]/_components/SaveSectionFlyout';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/class');
  }

  return (
    <section className="mx-auto my-5 rounded-md bg-white p-6">
      <PageTitle title="Class List" className="mb-3" />
      <div className="mx-7 flex justify-end">
        <LinkButton variant="primary" url="class/add">
          <FileText size={16} className="mr-2" />
          Add Class
        </LinkButton>
      </div>
      <ClassList />
      <SaveSectionFlyout />
    </section>
  );
}
