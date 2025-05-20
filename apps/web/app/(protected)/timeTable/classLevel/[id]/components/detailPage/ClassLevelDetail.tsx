'use client';

import { ClassWidget } from 'app/(protected)/academics/class/_components/ClassWidget';
import { StudentCard } from 'app/(protected)/academics/class/[classId]/section/[sectionId]/_components/StudentCard';
import { useGetClassLevelByIdQuery } from 'lib/queries/classLevel/useGetClassLevelByIdQuery';
import { PencilLine } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React from 'react';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, Text } from 'ui';
import { cn } from 'utils';

import { PageTitle } from '@/components/PageTitle';

const ClassLevelDetail = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const classLevelId = params.id;

  const {
    data: classLevelDetails,
    isLoading: isClassLevelLoading,
    isError,
  } = useGetClassLevelByIdQuery(classLevelId, {
    enabled: !!classLevelId,
  });

  const openFlyout = (key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, 'true');
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  if (isClassLevelLoading) return <div>Loading...</div>;

  if (isError) return <div>Error loading data.</div>;

  if (!classLevelDetails) return <div>No class found.</div>;

  return (
    <section className="w-full bg-gray-50 p-3">
      <PageTitle title="Class Details" className="mb-3" />
      <div className="mx-auto my-5 flex justify-between rounded-md bg-white p-6">
        <div className="flex">
          <div className="my-auto inline-flex px-5">
            <Text variant="base-bold" className="pr-5">
              {classLevelDetails?.name}
            </Text>
            <span
              className={cn(
                'rounded px-2.5 py-0.5 text-sm font-medium text-white',
                classLevelDetails?.isActive ? 'bg-green-500' : 'bg-red-500'
              )}
            >
              {classLevelDetails?.isActive ? 'Active' : 'Inactive'}
            </span>
            <Text
              variant="base-bold"
              className="ml-3 rounded bg-secondary px-2.5 py-0.5 text-sm  font-medium text-white"
            >
              {'AHM'}
            </Text>
          </div>
        </div>
        <div className="my-auto flex gap-4 px-5">
          <Button
            variant="outline"
            onClick={() => openFlyout('isUpdateClassFlyoutOpen')}
          >
            <PencilLine size={18} strokeWidth={2} className="text-primary" />
            <span className="pl-2 text-primary">Edit</span>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="Classes" className="relative mt-4 px-0 py-2">
        <TabsList className="w-full justify-start overflow-auto border-b-2 border-gray-400">
          {['Classes', 'Students', 'Staffs'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="mr-2 text-base focus:border-b-4 focus:border-primary"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="Classes">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {classLevelDetails.class.map((cls) => (
              <ClassWidget key={cls.id} classDetails={cls} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="Students">
          <section className="grid w-full grid-cols-1 justify-between gap-4 px-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {classLevelDetails.class.flatMap((item) =>
              item.students.map((item) => {
                const fullName = [
                  item.firstName,
                  item.middleName,
                  item.lastName,
                ].join(' ');
                return (
                  <div key={item.id}>
                    <StudentCard id={item.id} name={fullName} />
                  </div>
                );
              })
            )}
          </section>
        </TabsContent>
        <TabsContent value="Staffs"></TabsContent>
      </Tabs>
    </section>
  );
};

export default ClassLevelDetail;
