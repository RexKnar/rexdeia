'use client';

import { PlusCircle } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'ui/components/ui/Tabs';

import { AddStudentForm } from './AddStudentForm';

type AddStudentProps = {
  addStudentForm: Record<string, any>;
};

export function AddStudent({
  addStudentForm,
}: AddStudentProps) {
  return (
    <section className="w-full bg-gray-50 p-5">
      <div className="flex">
        <PlusCircle className="ml-5 mt-1" />
        <h1 className="ml-2 text-2xl font-semibold">Add New</h1>
      </div>

      <Tabs defaultValue="admission" className="mt-8">
        <TabsList>
          <TabsTrigger
            value="admission"
            className="mr-2 border text-base font-semibold shadow focus:border-b-4 focus:border-primary"
          >
            Add Student form
          </TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="admission">
          <AddStudentForm
            formConfig={addStudentForm}
            formId={addStudentForm.id}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
