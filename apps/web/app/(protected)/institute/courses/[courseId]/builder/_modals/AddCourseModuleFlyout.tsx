'use client';
import { CreateCourseModuleRequestModel } from 'lib/domain/institute/module';
import { useCreateCourseModuleMutationQuery } from 'lib/queries/institute/course/module/useCreateCourseModuleMutationQuery';
import { Loader2, PlusCircle } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Spinner,
  Text,
  Textarea,
} from 'ui';

import { useQueryParams } from '@/hooks/useQueryParams';

export function AddCourseModuleFlyout() {
  const { getParam, removeParams } = useQueryParams();
  const searchParams = useSearchParams();

  const routeParams = useParams<{ courseId: string }>();

  const courseId = searchParams.get('courseId') || routeParams.courseId;

  const isOpen = getParam('isAddCourseModuleFlyoutOpen') === 'true';

  const {
    isPending: isPendingCreateCourseModule,
    mutateAsync: mutateCreateCourseModuleAsync,
  } = useCreateCourseModuleMutationQuery(courseId);

  const closeFlyout = async () => {
    removeParams(['isAddCourseModuleFlyoutOpen']);
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      closeFlyout();
    }
  };
  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const saveCourseModule = async (payload: CreateCourseModuleRequestModel) => {
    try {
      const requestPayload = {
        ...payload,
        isActive: true,
      };

      const response = await mutateCreateCourseModuleAsync(requestPayload);
      if (response) {
        reset();
        closeFlyout();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section>
      <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => {
            removeParams(['isAddCourseModuleFlyoutOpen']);
          }}
        >
          {courseId == '2' ? (
            <section className="flex h-96 w-full flex-col items-center justify-center gap-4">
              <Spinner />
              <p>No data found</p>
            </section>
          ) : (
            <form onSubmit={handleSubmit(saveCourseModule)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        Add Module
                      </Text>
                    </div>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300"></hr>
              </SheetHeader>

              {courseId == '2' ? (
                <div className="flex h-96 w-full flex-col items-center justify-center gap-4">
                  <Spinner />
                  <p>Loading...</p>
                </div>
              ) : (
                <div className="mt-5">
                  <div className="mt-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Module Name
                    </label>
                    <Input
                      value={watch('name')}
                      {...register('name', {
                        required: 'Name is Required',
                      })}
                      id="name"
                      autoFocus
                      type="text"
                      className="mt-2"
                      placeholder="Enter Exam Name"
                      errorMessage={fieldErrors?.name?.message.toString()}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Description
                    </label>
                    <Textarea
                      {...register('description', {
                        required: 'description is Required',
                      })}
                      autoFocus
                      className="mt-2"
                      id="description"
                      errorMessage={fieldErrors?.description?.message.toString()}
                    />
                  </div>
                  <div className="mt-10">
                    <Button
                      size="lg"
                      variant="default"
                      disabled={isPendingCreateCourseModule}
                      aria-disabled={isPendingCreateCourseModule}
                      className="mx-auto flex justify-center px-12 py-4"
                    >
                      {isPendingCreateCourseModule ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                          Saving
                        </div>
                      ) : (
                        ` Save`
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
