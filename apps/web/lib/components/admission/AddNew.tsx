'use client';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'ui/components/ui/Tabs';

import { AdmissionForm } from './AdmissionForm';
import { EnquiryForm } from './EnquiryForm';

export function AddNew({ formConfig }) {
  return (
    <>
      <section className="m-o mt-4 w-full bg-gray-100 p-5">
        <h1 className="inter text-2xl font-semibold">Add new</h1>
        <Tabs defaultValue="account" className="mt-8">
          <TabsList>
            <TabsTrigger
              value="account"
              className="inter mr-2 text-base font-semibold focus:border-b-4 focus:border-primary"
            >
              Admission form
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="inter mr-2 text-base font-semibold focus:border-b-4 focus:border-primary"
            >
              Enquiry form
            </TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="account">
            <AdmissionForm formConfig={formConfig.admissionForm} />
          </TabsContent>
          <TabsContent value="password">
            <EnquiryForm formConfig={formConfig.enquiryForm} />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
