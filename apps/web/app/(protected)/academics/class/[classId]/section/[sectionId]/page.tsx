'use client';

import { Loader2, PencilLine } from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, Text } from 'ui';

import { PageTitle } from '@/components/PageTitle';

import { useGetSectionByIdQuery } from '../../../../../../../lib/queries/section/useGetSectionByIdQuery';
import { AddSubjectFlyout } from '../../_modals/AddSubjectFlyout';
import { UnassignStaffFlyout } from '../../_modals/UnassignStaffFlyout';
import { StaffList } from './_components/StaffList';
import { StudentList } from './_components/StudentList';
import { SubjectList } from './_components/SubjectList';

const AssignStudentFlyout = dynamic(() =>
  import('../../_modals/AssignStudentFlyout').then(
    (mod) => mod.AssignStudentFlyout
  )
);

const SaveAssignStaffFlyout = dynamic(() =>
  import('./_modals/SaveAssignStaffFlyout').then(
    (mod) => mod.SaveAssignStaffFlyout
  )
);

const SaveSectionFlyout = dynamic(() =>
  import('./_modals/SaveSectionFlyout').then((mod) => mod.SaveSectionFlyout)
);

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sectionId } = useParams<{ sectionId: string }>();

  const { data: getSectionResponse, isLoading: isGetSectionResponseLoading } =
    useGetSectionByIdQuery(sectionId);

  if (isGetSectionResponseLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black ">Fetching Section Details...</p>
      </div>
    );
  }

  if (!getSectionResponse) {
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
              variant="outline"
            >
              <PencilLine size={18} strokeWidth={2} />
              <span className="pl-2">Edit</span>
            </Button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="Students" className="relative mt-4 px-0 py-2">
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
          <div className="mb-4 flex items-center justify-between">
            <SubjectList />
            <Button
              variant="default"
              onClick={async () => {
                const params = new URLSearchParams(searchParams);
                params.set('isAddSubjectFlyoutOpen', 'true');
                router.replace(pathname + '?' + params.toString());
              }}
              className="absolute right-0 top-0"
            >
              Add Subject
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="Students">
          <section className="pt-5">
            <Button
              variant="default"
              onClick={async () => {
                const params = new URLSearchParams(searchParams);
                params.set('isAssignStudentFlyoutOpen', 'true');
                router.replace(pathname + '?' + params.toString());
              }}
              className="absolute right-0 top-0"
            >
              Assign Student
            </Button>
            <StudentList />
          </section>
        </TabsContent>
        <TabsContent value="Staffs">
          <section className="pt-5">
            <StaffList />
            <Button
              variant="default"
              onClick={async () => {
                const params = new URLSearchParams(searchParams);
                params.set('isSaveAssignStaffFlyoutOpen', 'true');

                router.replace(pathname + '?' + params.toString());
              }}
              className="absolute right-0 top-0"
            >
              Assign staff
            </Button>
          </section>
        </TabsContent>
        <TabsContent value="Assessments">
          <h1>Page 4</h1>
        </TabsContent>
      </Tabs>
      <AddSubjectFlyout />
      <SaveSectionFlyout />
      <AssignStudentFlyout />
      <SaveAssignStaffFlyout />
      <UnassignStaffFlyout />
    </section>
  );
}
