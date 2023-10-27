import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'ui/components/ui/Tabs';

import { authOptions } from '../../../../lib/auth';
import { AdmissionPage } from './components/AdmissionPage';
import { AdmissionsBreadcrumb } from './components/AdmissionsBreadcrumb';
import { EnquiryPage } from './components/EnquiryPage';
import { PageTitle } from '../../../../lib/components/PageTitle';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/admission/add');
  }

  return (
    <section className="flex h-full w-full flex-col gap-[20px] bg-gray-50 px-[25px] py-[40px] sm:px-[50px]">
      <AdmissionsBreadcrumb />
      <PageTitle title="Configure" />

      <Tabs defaultValue="admission" className="mt-4">
        <TabsList>
          <TabsTrigger
            value="admission"
            className="mr-2 text-base focus:border-b-4 focus:border-primary"
          >
            Admission form
          </TabsTrigger>
          <TabsTrigger
            value="enquiry"
            className="mr-2 text-base focus:border-b-4 focus:border-primary"
          >
            Enquiry form
          </TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="admission">
          <AdmissionPage
            branchId={session.branchId}
            organizationId={session.organizationId}
          />
        </TabsContent>
        <TabsContent value="enquiry">
          <EnquiryPage
            branchId={session.branchId}
            organizationId={session.organizationId}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
