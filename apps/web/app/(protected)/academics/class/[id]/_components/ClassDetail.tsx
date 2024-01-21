'use client';

import { Loader2, PencilLine } from 'lucide-react';
import { useParams } from 'next/navigation';
import { parseAsBoolean, useQueryState } from 'next-usequerystate';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, Text } from 'ui';
import { cn } from 'utils';

import { PageTitle } from '../../../../../../lib/components/PageTitle';
import { useGetClassByIdQuery } from '../../../../../../lib/queries/class/useGetClassByIdQuery';
import { SectionCard } from '../section/[sectionId]/_components/SectionCard';
import { StaffCard } from '../section/[sectionId]/_components/StaffCard';
import { UpdateClassFlyout } from './UpdateClassFlyout';

export function ClassDetail() {
  const params = useParams<{ id: string }>();
  const [, isUpdateClassFlyoutOpen] = useQueryState(
    'isUpdateClassFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );

  const { data: getClassByIdResponse, isLoading: isLoadingGetClassById } =
    useGetClassByIdQuery(params.id, {
      enabled: !!params.id,
    });

  if (isLoadingGetClassById) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className=" text-black">Fetching Class Details...</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-gray-50 p-3">
      {getClassByIdResponse.id ? (
        <>
          <PageTitle title="Class Details" className="mb-3" />
          <div className="space-between mx-auto my-5 flex justify-between rounded-md bg-white p-6">
            <div className="flex">
              <div className="my-auto inline-flex px-5">
                <Text variant="base-bold" className="pr-5">
                  {getClassByIdResponse.name}
                </Text>
                <span
                  className={cn(
                    'rounded px-2.5 py-0.5 text-sm font-medium  text-white',
                    getClassByIdResponse?.isActive
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  )}
                >
                  {getClassByIdResponse.isActive ? 'active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="my-auto flex gap-4 px-5">
              <div className="relative my-auto">
                <Button
                  className="text-primary"
                  onClick={() => {
                    isUpdateClassFlyoutOpen(true);
                  }}
                >
                  <PencilLine
                    size={18}
                    strokeWidth={2}
                    className="text-white"
                  />
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
              <TabsTrigger
                value="Sections"
                className="mr-2 text-base focus:border-b-4 focus:border-primary"
              >
                Sections
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
            <TabsContent value="Sections">
              <section className="pt-5">
                <div className="w-4/12">
                  <SectionCard />
                </div>
              </section>
            </TabsContent>
          </Tabs>
          <UpdateClassFlyout />
        </>
      ) : (
        ' Details Not Found'
      )}
    </section>
  );
}
