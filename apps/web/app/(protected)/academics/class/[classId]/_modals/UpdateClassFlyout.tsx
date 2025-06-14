'use client';

import { useGetClassByIdQuery } from 'lib/queries/class/useGetClassByIdQuery';
import { useUpdateClassMutationQuery } from 'lib/queries/class/useUpdateClassMutationQuery';
import { useGetClassLevelListQuery } from 'lib/queries/classLevel/useGetClassLevelsListQuery';
import { useGetGradeList } from 'lib/queries/grade/useGetGradeListMutationQuery';
import { Loader2, PlusCircle } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Switch,
  Text,
} from 'ui';

export function UpdateClassFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ classId: string }>();
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const { data: getClassByIdResponse } = useGetClassByIdQuery(params.classId, {
    enabled: !!params.classId,
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      isActive: false,
      name: getClassByIdResponse?.name || '',
      classLevelId: getClassByIdResponse?.classLevelId || '',
      gradeId: getClassByIdResponse?.gradeId || '',
    },
  });

  const isOpen = searchParams.get('isUpdateClassFlyoutOpen') === 'true';

  useEffect(() => {
    if (getClassByIdResponse) {
      const { name, isActive, classLevelId, gradeId } = getClassByIdResponse;

      setValue('name', name);
      setValue('isActive', isActive);
      setValue('classLevelId', classLevelId);
      setValue('gradeId', gradeId);
    } else {
      setValue('name', null);
      setValue('isActive', false);
      setValue('classLevelId', null);
      setValue('gradeId', null);
    }
  }, [getClassByIdResponse, setValue]);

  const {
    isPending: isPendingUpdateClass,
    mutateAsync: mutateUpdateClassAsync,
  } = useUpdateClassMutationQuery(params.classId);
  const { data: ClassLevelListResponse, isLoading: isClassLevelListLoading } =
    useGetClassLevelListQuery({
      page,
      limit,
    });

  const { data: gradeListResponse, isLoading: isGradeListLoading } =
    useGetGradeList({
      page: 1,
      limit: 999,
    });
  async function updateClass(payload) {
    try {
      const updateClassPayload = {
        ...payload,
        id: params.classId,
      };
      mutateUpdateClassAsync(updateClassPayload);
    } catch (error) {
      console.error(error);
    } finally {
      setValue('isActive', false);
      reset();
      const params = new URLSearchParams(searchParams);
      params.set('isUpdateClassFlyoutOpen', 'false');
      params.delete('regulationId');

      router.replace(pathname + '?' + params.toString());
    }
  }

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className=" w-72 bg-white px-4 py-6 md:w-[28rem] lg:w-[32rem]"
          onCloseClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set('isUpdateClassFlyoutOpen', 'false');
            params.delete('regulationId');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          <form onSubmit={handleSubmit(updateClass)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Update Class
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      id="isActive"
                      {...register('isActive')}
                      onCheckedChange={(value) => setValue('isActive', value)}
                      checked={watch('isActive')}
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 text-sm font-semibold"
                    >
                      {watch('isActive') ? 'Active' : 'Inactive'}
                    </label>
                  </div>
                </div>
              </SheetTitle>
              <hr className="border-t border-gray-300"></hr>
            </SheetHeader>

            <div className="mt-5">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Class Name
                </label>
                <Input
                  {...register('name', {
                    required: 'Class Name is Required',
                  })}
                  autoFocus
                  className="mt-2"
                  id="name"
                  errorMessage={fieldErrors?.name?.message.toString()}
                />
              </div>
              <div>
                <label
                  htmlFor="medium"
                  className="text-sm font-semibold text-gray-700"
                >
                  Class Level
                </label>
                <Controller
                  control={control}
                  name={`classLevelId`}
                  render={({ field }) => {
                    return (
                      <Select
                        onValueChange={field.onChange}
                        {...field}
                        disabled={isClassLevelListLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {ClassLevelListResponse?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    );
                  }}
                ></Controller>
              </div>
              <div>
                <label
                  htmlFor="medium"
                  className="text-sm font-semibold text-gray-700"
                >
                  Grade System(for marks)
                </label>
                <Controller
                  control={control}
                  name={`gradeId`}
                  render={({ field }) => {
                    return (
                      <Select
                        onValueChange={field.onChange}
                        {...field}
                        disabled={isGradeListLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {gradeListResponse?.data?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    );
                  }}
                ></Controller>
              </div>
              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  disabled={isPendingUpdateClass}
                  aria-disabled={isPendingUpdateClass}
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingUpdateClass ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Updating
                    </div>
                  ) : (
                    'Update'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
