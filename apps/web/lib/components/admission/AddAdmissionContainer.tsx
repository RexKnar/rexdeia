'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'ui/components/ui/Tabs';

import { AdmissionForm } from './AdmissionForm';
import { EnquiryForm } from './EnquiryForm';

type AddAdmissionContainerProp = {
  enquiryForm: Record<string, any>;
  admissionForm: Record<string, any>;
};

export function AddAdmissionContainer({
  enquiryForm,
  admissionForm,
}: AddAdmissionContainerProp) {
  return (
    <section className="w-full p-5">
      <h1 className="inter text-2xl font-semibold">Add new</h1>
      <Tabs defaultValue="admission" className="mt-8">
        <TabsList>
          <TabsTrigger
            value="admission"
            className="mr-2 text-base font-semibold focus:border-b-4 focus:border-primary"
          >
            Admission form
          </TabsTrigger>
          <TabsTrigger
            value="enquiry"
            className="mr-2 text-base font-semibold focus:border-b-4 focus:border-primary"
          >
            Enquiry form
          </TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="admission">
          <AdmissionForm formConfig={admissionForm} formId={admissionForm.id} />
        </TabsContent>
        <TabsContent value="enquiry">
          <EnquiryForm formConfig={enquiryForm} formId={enquiryForm.id} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
