'use client';
import { CreateCourseChapterRequestModel } from 'lib/domain/institute/chapter';
import { useCreateCourseChapterMutationQuery } from 'lib/queries/institute/course/chapter/useCreateCourseChapterMutationQuery';
import { useGetChapterDetailByIdQuery } from 'lib/queries/institute/course/chapter/useGetChapterDetailByIdQuery';
import { useUpdateCourseChapterMutationQuery } from 'lib/queries/institute/course/chapter/useUpdateCourseChapterMutationQuery';
import { Loader2, PlusCircle } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
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

export function AddCourseChapterFlyout() {
  const { getParam, removeParams } = useQueryParams();
  const searchParams = useSearchParams();

  const routeParams = useParams<{
    courseId: string;
    moduleId: string;
    chapterId: string;
  }>();

  const courseId = searchParams.get('courseId') || routeParams.courseId;

  const isOpen = getParam('isAddCourseChapterFlyoutOpen') === 'true';
  const moduleId = getParam('moduleId');
  const chapterId = getParam('chapterId');

  const {
    data: getCourseChapterDetailByIdResponse,
    isLoading: isLoadingChapter,
  } = useGetChapterDetailByIdQuery(chapterId, { enabled: !!chapterId });

  useEffect(() => {
    setValue('name', getCourseChapterDetailByIdResponse?.name);
    setValue('description', getCourseChapterDetailByIdResponse?.description);
  }, [getCourseChapterDetailByIdResponse]);

  const {
    isPending: isPendingCreateCourseChapter,
    mutateAsync: mutateCreateCourseChapterAsync,
  } = useCreateCourseChapterMutationQuery(courseId);

  const {
    isPending: isPendingUpdateCourseChapter,
    mutateAsync: mutateUpdateCourseChapterAsync,
  } = useUpdateCourseChapterMutationQuery(courseId);

  const closeFlyout = async () => {
    removeParams(['isAddCourseChapterFlyoutOpen', 'moduleId', 'chapterId']);
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
    setValue,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      moduleId: '',
    },
  });

  useEffect(() => {
    if (moduleId) {
      setValue('moduleId', moduleId);
    }
  }, [moduleId]);
  const saveCourseChapter = async (
    payload: CreateCourseChapterRequestModel
  ) => {
    try {
      let response = null;
      let requestPayload = {
        ...payload,
        isActive: true,
      };
      if (chapterId) {
        requestPayload = {
          ...requestPayload,
          id: chapterId,
        };
        response = await mutateUpdateCourseChapterAsync(requestPayload);
      } else {
        response = await mutateCreateCourseChapterAsync(requestPayload);
      }
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
            removeParams(['isAddCourseChapterFlyoutOpen']);
          }}
        >
          {isLoadingChapter ? (
            <section className="flex h-96 w-full flex-col items-center justify-center gap-4">
              <Spinner />
              {/* <p>No data found</p> */}
            </section>
          ) : (
            <form onSubmit={handleSubmit(saveCourseChapter)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        Add Chapter
                      </Text>
                    </div>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300"></hr>
              </SheetHeader>

              {isLoadingChapter ? (
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
                      Chapter Name
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
                      disabled={isPendingCreateCourseChapter}
                      aria-disabled={isPendingCreateCourseChapter}
                      className="mx-auto flex justify-center px-12 py-4"
                    >
                      {isPendingCreateCourseChapter ||
                      isPendingUpdateCourseChapter ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                          Saving
                        </div>
                      ) : chapterId ? (
                        'Update'
                      ) : (
                        'Save'
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
