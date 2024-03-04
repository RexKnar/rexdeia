'use client';

import { Loader2, PencilLine, PlusCircle } from 'lucide-react';
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
import { AddSubjectFlyout } from '../_modals/AddSubjectFlyout';
import { AssignStudentFlyout } from '../_modals/AssignStudentFlyout';
import { UpdateClassFlyout } from '../_modals/UpdateClassFlyout';
import { ExamLists } from './ExamLists';
import { SectionList } from './SectionList';
import { StaffList } from './StaffList';
import { StudentList } from './StudentList';
import { SubjectList } from './SubjectList';

export function ClassDetail() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams<{ classId: string }>();
  const searchParams = useSearchParams();

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
                  className="text-primary"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('isSectionFlyoutOpen', 'true');
                    router.replace(pathname + '?' + params.toString());
                  }}
                >
                  <PlusCircle
                    size={20}
                    strokeWidth={1.5}
                    className="text-white"
                  />
                  <span className="pl-2 text-white">Add Section</span>
                </Button>
              </div>
              <div className="relative my-auto">
                <Button
                  className="text-primary"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('isUpdateClassFlyoutOpen', 'true');

                    router.replace(pathname + '?' + params.toString());
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
                >
                  Add Subject
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="Students">
              <Button
                variant="default"
                onClick={async () => {
                  const params = new URLSearchParams(searchParams);
                  params.set('isAssignStudentFlyoutOpen', 'true');
                  router.replace(pathname + '?' + params.toString());
                }}
              >
                Assign Student
              </Button>
              <StudentList />
            </TabsContent>
            <TabsContent value="Staffs">
              <section className="pt-5">
                <div className="w-3/12">
                  <StaffList />
                </div>
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
                >
                  Assign Staff
                </Button>
              </section>
            </TabsContent>
            <TabsContent value="Sections">
              <section className="pt-5">
                <SectionList />
              </section>
            </TabsContent>
            <TabsContent value="Assessments">
              <ExamLists />
            </TabsContent>
          </Tabs>
          <UpdateClassFlyout />
          <AssignStudentFlyout />
          <AddSubjectFlyout />
        </>
      ) : (
        ' Details Not Found'
      )}
    </section>
  );
}
