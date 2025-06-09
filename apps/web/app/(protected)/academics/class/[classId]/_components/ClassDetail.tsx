'use client';
import { useGetClassLevelByIdQuery } from 'lib/queries/classLevel/useGetClassLevelByIdQuery';
import { useDeleteSubjectMutationQuery } from 'lib/queries/subjects/useDeleteSubjectMutationQuery';
import { Loader2, PencilLine } from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect } from 'react';
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  toast,
} from 'ui';
import { cn } from 'utils';

import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { PageTitle } from '@/components/PageTitle';

import { useGetClassByIdQuery } from '../../../../../../lib/queries/class/useGetClassByIdQuery';
import { AssignSubjectToStudentFlyout } from '../_modals/AssignSubjectToStudent';
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

const UnassignStaffFlyout = dynamic(() =>
  import('../_modals/UnassignStaffFlyout').then(
    (mod) => mod.UnassignStaffFlyout
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
  const classLevelId = getClassByIdResponse?.classLevelId;
  const isOpen = searchParams.get('isDeleteConfirmationModalOpen') === 'true';
  const subjectId = searchParams.get('subjectId');
  const subjectName = searchParams.get('subjectName');
  const { isSuccess: isDeleteSuccess, mutateAsync: deleteSubjectAsync } =
    useDeleteSubjectMutationQuery(params.classId);

  const { data: classLevelDetails } = useGetClassLevelByIdQuery(classLevelId);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Group deleted successfully',
      });
      closeFlyout();
    }
  }, [isDeleteSuccess, toast]);

  if (isLoadingGetClassById) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-6 h-6 mr-2 text-black animate-spin" />
        <p className="text-black ">Fetching Class Details...</p>
      </div>
    );
  }
  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('isDeleteConfirmationModalOpen');
    params.delete('subjectId');
    params.delete('subjectName');
    router.replace(pathname + '?' + params.toString());
  };

  return (
    <section className="w-full p-3 bg-gray-50">
      {!isLoadingGetClassById ? (
        <div>
          {getClassByIdResponse?.id ? (
            <>
              <PageTitle title="Class Details" className="mb-3" />
              <div className="flex justify-between p-6 mx-auto my-5 bg-white rounded-md ">
                <div className="flex">
                  <div className="inline-flex px-5 my-auto">
                    <Text variant="base-bold" className="pr-5">
                      {getClassByIdResponse?.name}
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
                    <Text
                      variant="base-bold"
                      className="ml-3 rounded bg-secondary px-2.5 py-0.5 text-sm  font-medium text-white"
                    >
                      {classLevelDetails?.name}
                    </Text>
                  </div>
                </div>
                <div className="flex gap-4 px-5 my-auto">
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
                      <span className="hidden pl-2 text-primary sm:inline">
                        Edit
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
              <Tabs defaultValue="Students" className="relative px-0 py-2 mt-4">
                <TabsList className="justify-start w-full overflow-auto border-b-2 border-gray-400">
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
                  <div className="flex items-center justify-between mb-4">
                    <SubjectList />
                    <Button
                      variant="default"
                      onClick={async () => {
                        const params = new URLSearchParams(searchParams);
                        params.set('isAddSubjectFlyoutOpen', 'true');
                        router.replace(pathname + '?' + params.toString());
                      }}
                      className="absolute top-0 right-0"
                    >
                      Add Subject
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="Students">
                  <Button
                    variant="default"
                    onClick={() =>
                      router.push(
                        `/academics/class/${[classId]}/assign/student`
                      )
                    }
                    className="absolute top-0 right-0"
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
                      className="absolute top-0 right-0"
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
                      className="absolute top-0 right-0"
                    >
                      Add Section
                    </Button>
                  </section>
                </TabsContent>
                <TabsContent value="Assessments">
                  <ExamLists />
                </TabsContent>
              </Tabs>
              <DeleteConfirmationModal
                open={isOpen}
                description={`Are you sure you want to delete "${subjectName}"`}
                onDeleteClick={async () => {
                  if (subjectId) {
                    await deleteSubjectAsync(subjectId);
                    closeFlyout;
                  }
                }}
                onCancelClick={closeFlyout}
              />
            </>
          ) : (
            ' Details Not Found'
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 mr-2 text-black animate-spin" />
          <p className="text-black ">Fetching Class Details...</p>
        </div>
      )}

      <AssignStaffClassDetailPageFlyout />
      <UpdateClassFlyout />
      <SaveSectionFlyout />
      <AddSubjectFlyout />
      <UnassignStaffFlyout />
      <AssignSubjectToStudentFlyout />
    </section>
  );
}
