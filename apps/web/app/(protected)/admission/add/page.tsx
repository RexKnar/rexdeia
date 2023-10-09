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

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/admission/add');
  }

  return (
    <section className="w-full bg-gray-50 p-3">
      <section className="mx-6 mt-8">
        <AdmissionsBreadcrumb />
      </section>

      <Tabs defaultValue="admission" className="mt-8">
        <TabsList>
          <TabsTrigger
            value="admission"
            className="ml-4 mr-2 text-base focus:border-b-4 focus:border-primary"
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
