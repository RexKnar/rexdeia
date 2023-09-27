'use client';

import { PlusCircle } from 'lucide-react';
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
    <section className="w-full bg-gray-50 p-5">
      <div className="flex">
        <PlusCircle className="ml-5 mt-1" />
        <h1 className="inter ml-2 text-2xl font-semibold">Add New</h1>
      </div>

      <Tabs defaultValue="admission" className="mt-8">
        <TabsList>
          <TabsTrigger
            value="admission"
            className="ml-4 mr-2 border text-base font-semibold shadow focus:border-b-4 focus:border-primary"
          >
            Admission form
          </TabsTrigger>
          <TabsTrigger
            value="enquiry"
            className="mr-2 border text-base font-semibold shadow focus:border-b-4 focus:border-primary"
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
