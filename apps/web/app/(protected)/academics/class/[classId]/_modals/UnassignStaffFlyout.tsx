'use client';

// import { UnassignStaffModel } from 'lib/domain/staff';
import { useGetStaffSubjectListByClassIdQuery } from 'lib/queries/staff/useGetStaffSubjectListQuery';
import { useUnassignStaffFromSubjectMutationQurey } from 'lib/queries/staff/useUnassignStaffFromSubjectsMutationQurey';
import { CircleMinus, Loader2 } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from 'ui';

export function UnassignStaffFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ classId: string }>();
  const { data: session } = useSession();

  const isOpen = searchParams.get('isUnassignStaffFlyoutOpen') === 'true';
  const staffId = searchParams.get('staffId');
  const academicYearId =
    searchParams.get('academicYearId') || session.currentBatch;
  const { data: getStaffSubjectListResponse, isLoading } =
    useGetStaffSubjectListByClassIdQuery(
      params.classId,
      staffId,
      academicYearId,
      {
        enabled: !!staffId,
      }
    );

  const { isPending: isUnAssignStaffPending, mutateAsync: unassignStaffAsync } =
    useUnassignStaffFromSubjectMutationQurey(
      params.classId,
      staffId,
      academicYearId
    );

  const { handleSubmit, control, reset } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: 'sections',
  });

  const closeFlyout = () => {
    reset({ sections: [] });
    const params = new URLSearchParams(searchParams);
    params.delete('academicYearId');
    params.delete('staffId');
    params.delete('isUnassignStaffFlyoutOpen');
    router.replace(pathname + '?' + params.toString());
  };

  async function onsubmit(payload) {
    try {
      const response = await unassignStaffAsync(payload);
      if (response) {
        closeFlyout();
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (isOpen && getStaffSubjectListResponse) {
      getStaffSubjectListResponse.forEach((item) => {
        append({
          sectionId: item.sectionId,
          sectionName: item.sectionName,
          subjects: [],
        });
      });
    }
  }, [isOpen, getStaffSubjectListResponse]);
  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeFlyout()}
        >
          <SheetHeader>
            <SheetTitle className="mb-5">
              <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                <div className="flex items-center">
                  <CircleMinus size={20} strokeWidth={1.5} />
                  <Text variant="lg-semibold" className="ml-2">
                    Unassign Staff
                  </Text>
                </div>
              </div>
            </SheetTitle>
            <hr className="border-t border-gray-300"></hr>
          </SheetHeader>
          {isLoading ? (
            <Text className="text-center text-lg text-primary-800">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
            </Text>
          ) : (
            <form onSubmit={handleSubmit(onsubmit)}>
              <div className="mt-6">
                {fields.map((section, index) => {
                  return (
                    <div className="mt-2" key={section.id}>
                      <label
                        htmlFor="subjectName"
                        className="text-sm font-semibold text-gray-700"
                      >
                        {getStaffSubjectListResponse[index]?.sectionName}
                      </label>
                      <div className="me-6 mt-2 flex flex-wrap items-center">
                        {getStaffSubjectListResponse[index]?.subjects.map(
                          (subject) => {
                            return (
                              <Controller
                                key={subject.id}
                                control={control}
                                name={`sections.${index}.subjects`}
                                render={({ field }) => (
                                  <>
                                    <Checkbox
                                      className="me-2 items-center space-x-2 rounded border border-primary-500"
                                      checked={field.value.includes(subject.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.onChange([
                                            ...field.value,
                                            subject.id,
                                          ]);
                                        } else {
                                          field.onChange(
                                            field.value.filter(
                                              (id) => id !== subject.id
                                            )
                                          );
                                        }
                                      }}
                                    >
                                      {subject.name}
                                    </Checkbox>
                                    <label className="me-5">
                                      <span>{subject.name}</span>
                                    </label>
                                  </>
                                )}
                              />
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                type="submit"
                size="lg"
                variant="default"
                className="mx-auto mt-8 flex justify-center px-12 py-4"
              >
                {' '}
                {isUnAssignStaffPending ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                    removing
                  </div>
                ) : (
                  'remove'
                )}
              </Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
