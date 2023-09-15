'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/components/ui/Tabs"
import { EnquiryForm } from "./EnquiryForm";
import { AdmissionForm } from "./AdmissionForm";

export function AddNew({ formConfig }) {
  
  return (
    <>
    <section className="mt-4 w-full bg-gray-100 p-5 m-o">
    <h1 className="text-2xl inter font-semibold">Add new</h1>
    <Tabs defaultValue="account" className="mt-8">
      <TabsList>
        <TabsTrigger value="account" className="text-base font-semibold inter mr-2 focus:border-b-4 focus:border-primary">Admission form</TabsTrigger>
        <TabsTrigger value="password" className="text-base font-semibold inter mr-2 focus:border-b-4 focus:border-primary">Enquiry form</TabsTrigger>
      </TabsList>
        <TabsContent className="w-full" value="account"><AdmissionForm formConfig={formConfig.admissionForm}/></TabsContent>
        <TabsContent value="password"><EnquiryForm formConfig={formConfig.enquiryForm}/></TabsContent>
    </Tabs>

    </section>
      
    </>
  );
}
