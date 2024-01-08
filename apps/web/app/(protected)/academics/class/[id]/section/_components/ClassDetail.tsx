'use client';
import { PencilLine } from 'lucide-react';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, Text } from 'ui';

import { PageTitle } from '../../../../../../../lib/components/PageTitle';
import { StaffCard } from '../[sectionId]/_components/StaffCard';

export default function ClassDetail() {
  return (
    <section>
      <section className="w-full bg-gray-50 p-3">
        <PageTitle title="Class Details" className="mb-3" />

        <div className="space-between mx-auto my-5 flex justify-between rounded-md bg-white p-6">
          <div className="flex">
            <div className="my-auto inline-flex px-5">
              <Text variant="base-bold" className="pr-5">
                Class name
              </Text>
              <span className="me-2 rounded bg-indigo-100 px-2.5 py-0.5 text-sm font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                English
              </span>
              <span className="me-2 rounded bg-pink-100 px-2.5 py-0.5 text-sm font-medium text-pink-800 dark:bg-pink-900 dark:text-pink-300">
                Department
              </span>
            </div>
          </div>
          <div className="my-auto flex gap-4 px-5">
            <div className="relative my-auto">
              <Button className="text-primary">
                <PencilLine size={18} strokeWidth={2} className="text-white" />
                <span className="pl-2 text-white">Edit</span>
              </Button>
            </div>
          </div>
        </div>
        <Tabs defaultValue="Students" className="mt-4">
          <TabsList className="w-full justify-start border-b-2 border-gray-400">
            <TabsTrigger
              value="Subjects"
              className="mr-2 text-base focus:border-b-4 focus:border-primary"
            >
              Subjects
            </TabsTrigger>
            <TabsTrigger
              value="Students"
              className="mr-2 text-base focus:border-b-4 focus:border-primary"
            >
              Students
            </TabsTrigger>
            <TabsTrigger
              value="Staffs"
              className="mr-2 text-base focus:border-b-4 focus:border-primary"
            >
              Staffs
            </TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="Subjects">
            <section className="pt-5">
              <div className="w-3/12">Page1</div>
            </section>
          </TabsContent>
          <TabsContent value="Students">
            <h1>Page 2</h1>
          </TabsContent>
          <TabsContent value="Staffs">
            <section className="pt-5">
              <div className="w-3/12">
                <StaffCard />
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </section>
    </section>
  );
}
