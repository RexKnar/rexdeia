'use client';

import { Loader2, PencilLine } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, Text } from 'ui';

import { PageTitle } from '../../../../../../../lib/components/PageTitle';
import { useGetSectionByIdQuery } from '../../../../../../../lib/queries/section/useGetSectionByIdQuery';
import { SaveSectionFlyout } from './_components/SaveSectionFlyout';
import { StaffList } from './_components/StaffList';
import { StudentList } from './_components/StudentList';
import { SubjectList } from './_components/SubjectList';

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ sectionId: string }>();

  const {
    data: getSectionResponse,
    isError: isGetSectionResponseError,
    isLoading: isGetSectionResponseLoading,
  } = useGetSectionByIdQuery(params.sectionId);

  if (isGetSectionResponseLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black ">Fetching Section Details...</p>
      </div>
    );
  }

  if (isGetSectionResponseError) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-black ">No Data Found</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-gray-50 p-3">
      <PageTitle title="Section Details" className="mb-3" />
      <div className="space-between mx-auto my-5 flex justify-between rounded-md bg-white p-6">
        <div className="flex">
          <div className="my-auto inline-flex px-5">
            <Text variant="base-bold" className="pr-5">
              {getSectionResponse.name}
            </Text>
            <span className="me-2 rounded bg-indigo-100 px-2.5 py-0.5 text-sm font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
              {getSectionResponse.medium.name}
            </span>
          </div>
        </div>
        <div className="my-auto flex gap-4 px-5">
          <div className="relative my-auto">
            <Button
              className="text-primary"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('isSectionFlyoutOpen', 'true');

                router.replace(pathname + '?' + params.toString());
              }}
            >
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
          <TabsTrigger
            value="Assessments"
            className="mr-2 text-base focus:border-b-4 focus:border-primary"
          >
            Assessments
          </TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="Subjects">
          <section className="pt-5">
            <SubjectList />
          </section>
        </TabsContent>
        <TabsContent value="Students">
          <section className="pt-5">
            <StudentList />
          </section>
        </TabsContent>
        <TabsContent value="Staffs">
          <section className="pt-5">
            <StaffList />
          </section>
        </TabsContent>
        <TabsContent value="Assessments">
          <h1>Page 4</h1>
        </TabsContent>
      </Tabs>
      <SaveSectionFlyout />
    </section>
  );
}
