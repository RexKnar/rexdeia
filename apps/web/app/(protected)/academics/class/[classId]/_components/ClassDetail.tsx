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
import { cn } from 'utils';

import { PageTitle } from '@/components/PageTitle';

import { useGetClassByIdQuery } from '../../../../../../lib/queries/class/useGetClassByIdQuery';
import { ExamLists } from './ExamLists';
import { SectionList } from './SectionList';
import { StaffList } from './StaffList';
import { StudentList } from './StudentList';
import { SubjectList } from './SubjectList';

const AddSubjectFlyout = dynamic(() =>
  import('../_modals/AddSubjectFlyout').then((mod) => mod.AddSubjectFlyout)
);

const UpdateClassFlyout = dynamic(() =>
  import('../_modals/UpdateClassFlyout').then((mod) => mod.UpdateClassFlyout)
);

const AssignStaffClassDetailPageFlyout = dynamic(() =>
  import('../_modals/AssignStaffClassDetailPageFlyout').then(
    (mod) => mod.AssignStaffClassDetailPageFlyout
  )
);

const SaveSectionFlyout = dynamic(() =>
  import('../section/[sectionId]/_modals/SaveSectionFlyout').then(
    (mod) => mod.SaveSectionFlyout
  )
);

export function ClassDetail() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams<{ classId: string }>();
  const searchParams = useSearchParams();
  const { classId } = useParams();
  const { data: getClassByIdResponse, isLoading: isLoadingGetClassById } =
    useGetClassByIdQuery(params.classId, {
      enabled: !!params.classId,
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
                  variant="outline"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('isUpdateClassFlyoutOpen', 'true');

                    router.replace(pathname + '?' + params.toString());
                  }}
                >
                  <PencilLine
                    size={18}
                    strokeWidth={2}
                    className="text-primary"
                  />
                  <span className="pl-2 text-primary">Edit</span>
                </Button>
              </div>
            </div>
          </div>
          <Tabs defaultValue="Students" className="relative mt-4 p-2">
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
              <Button
                variant="default"
                onClick={() =>
                  router.push(`/academics/class/${[classId]}/assign/student`)
                }
                className="absolute right-0 top-0"
              >
                Assign Students
              </Button>
              <StudentList />
            </TabsContent>
            <TabsContent value="Staffs">
              <section className="pt-5">
                <StaffList />
                <Button
                  variant="default"
                  onClick={async () => {
                    const params = new URLSearchParams(searchParams);
                    params.set(
                      'isAssignStaffClassDetailPageFlyoutOpen',
                      'true'
                    );
                    router.replace(pathname + '?' + params.toString());
                  }}
                  className="absolute right-0 top-0"
                >
                  Assign Staff
                </Button>
              </section>
            </TabsContent>
            <TabsContent value="Sections">
              <section className="pt-5">
                <SectionList />
                <Button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('isSectionFlyoutOpen', 'true');
                    router.replace(pathname + '?' + params.toString());
                  }}
                  className="absolute right-0 top-0"
                >
                  Add Section
                </Button>
              </section>
            </TabsContent>
            <TabsContent value="Assessments">
              <ExamLists />
            </TabsContent>
          </Tabs>
          <AssignStaffClassDetailPageFlyout />
          <UpdateClassFlyout />
          <SaveSectionFlyout />
          <AddSubjectFlyout />
        </>
      ) : (
        ' Details Not Found'
      )}
    </section>
  );
}
