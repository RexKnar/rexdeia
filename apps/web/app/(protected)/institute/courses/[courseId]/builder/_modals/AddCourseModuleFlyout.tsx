'use client';

import { CreateCourseModuleRequestModel } from 'lib/domain/institute/module';
import { useCreateCourseModuleMutationQuery } from 'lib/queries/institute/course/module/useCreateCourseModuleMutationQuery';
import { useGetModuleDetailByIdQuery } from 'lib/queries/institute/course/module/useGetModuleDetailByIdQuery';
import { useUpdateCourseModuleMutationQuery } from 'lib/queries/institute/course/module/useUpdateCourseModuleMutationQuery';
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

export function AddCourseModuleFlyout() {
  const { getParam, removeParams } = useQueryParams();
  const searchParams = useSearchParams();
  const routeParams = useParams<{ courseId: string }>();

  const courseId = searchParams.get('courseId') || routeParams.courseId;
  const moduleId = searchParams.get('moduleId');

  const isOpen = getParam('isAddCourseModuleFlyoutOpen') === 'true';

  const { data: moduleDetail, isLoading: isLoadingModule } =
    useGetModuleDetailByIdQuery(moduleId, { enabled: !!moduleId });

  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseModuleRequestModel>({
    defaultValues: {
      name: '',
      description: '',
      courseId: '',
    },
  });

  useEffect(() => {
    if (moduleDetail) {
      setValue('name', moduleDetail.name || '');
      setValue('description', moduleDetail.description || '');
    }
  }, [moduleDetail, setValue]);

  useEffect(() => {
    if (courseId) {
      setValue('courseId', courseId);
    }
  }, [courseId, setValue]);

  const { isPending: isCreating, mutateAsync: createModule } =
    useCreateCourseModuleMutationQuery(courseId);

  const { isPending: isUpdating, mutateAsync: updateModule } =
    useUpdateCourseModuleMutationQuery(courseId);

  const closeFlyout = () => {
    reset();
    removeParams(['isAddCourseModuleFlyoutOpen', 'courseId', 'moduleId']);
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) closeFlyout();
  };

  const saveCourseModule = async (data: CreateCourseModuleRequestModel) => {
    try {
      const payload = {
        ...data,
        isActive: true,
      };

      let response;

      if (moduleId) {
        response = await updateModule({
          ...payload,
          id: moduleId.trim(),
        });
      } else {
        response = await createModule(payload);
      }

      if (response) {
        closeFlyout();
      }
    } catch (error) {
      console.error('Failed to save module:', error);
    }
  };

  return (
    <section>
      <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeFlyout()}
        >
          {courseId === '2' ? (
            <section className="flex h-96 w-full flex-col items-center justify-center gap-4">
              <Spinner />
              <p>No data found</p>
            </section>
          ) : (
            <form onSubmit={handleSubmit(saveCourseModule)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="flex items-center gap-4">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold">
                      {moduleId ? 'Update Module' : 'Add Module'}
                    </Text>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300" />
              </SheetHeader>

              <div className="mt-5 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Module Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter Module Name"
                    className="mt-2"
                    {...register('name', { required: 'Name is required' })}
                    errorMessage={errors.name?.message}
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Enter Description"
                    className="mt-2"
                    {...register('description', {
                      required: 'Description is required',
                    })}
                    errorMessage={errors.description?.message}
                  />
                </div>

                <div className="mt-10">
                  <Button
                    type="submit"
                    size="lg"
                    variant="default"
                    disabled={isCreating || isUpdating || isLoadingModule}
                    className="mx-auto flex justify-center px-12 py-4"
                  >
                    {isCreating || isUpdating || isLoadingModule ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                        Saving
                      </div>
                    ) : moduleId ? (
                      'Update'
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
