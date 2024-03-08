'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
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
  Spinner,
  Switch,
  Text,
} from 'ui';
import * as z from 'zod';

import { CreateSubjectModel } from '../../../../../lib/domain/subject';
import { useGetAssessmentFormatList } from '../../../../../lib/queries/assessment-format/useGetAssessmentFormatList';
import { useGetGroupListQuery } from '../../../../../lib/queries/group/useGetGroupListQuery';
import { useGetSubjectTypeList } from '../../../../../lib/queries/subject-type/useGetSubjectTypeQuery';
import { useCreateSubjectMutationQuery } from '../../../../../lib/queries/subjects/useCreateSubjectMutationQuery';
import { useGetSubjectByIdQuery } from '../../../../../lib/queries/subjects/useGetSubjectByIdQuery';
import { useUpdateSubjectMutationQuery } from '../../../../../lib/queries/subjects/useUpdateSubjectMutationQuery';

const schema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(1),
  subjectTypeId: z
    .string({
      required_error: 'Subject Type is required',
    })
    .min(1),
  assessmentFormatIds: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'Assessment Format is required',
    }),
  groupId: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Group is required',
  }),
  isActive: z.boolean().default(true),
});

type SchemaType = z.infer<typeof schema>;

export function SaveSubjectFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectId = searchParams.get('subjectId');
  const isOpen = searchParams.get('isFlyoutOpen') === 'true';

  const {
    control,
    watch,
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      assessmentFormatIds: [],
      groupId: [],
    },
  });

  const {
    data: subjectTypeList,
    isLoading: isSubjectTypeListLoading,
    isFetching: isSubjectTypeListFetching,
  } = useGetSubjectTypeList({
    page: 1,
    limit: 999,
  });

  const {
    data: assessmentFormatList,
    isLoading: isAssessmentFormatLoading,
    isFetching: isAssessmentFormatFetching,
  } = useGetAssessmentFormatList({
    page: 1,
    limit: 999,
  });
  const {
    data: groupList,
    isLoading: isGroupListLoading,
    isFetching: isGroupListFetching,
  } = useGetGroupListQuery({
    page: 1,
    limit: 999,
  });

  const {
    data: currentSubject,
    isLoading: isCurrentSubjectLoading,
    isFetching: isCurrentSubjectFetching,
  } = useGetSubjectByIdQuery(subjectId, {
    enabled: !!subjectId,
  });

  const {
    isPending: isPendingCreateSubjects,
    mutateAsync: mutateCreateSubjectsAsync,
  } = useCreateSubjectMutationQuery();

  const {
    isPending: isPendingUpdateSubjects,
    mutateAsync: mutateUpdateSubjectsAsync,
  } = useUpdateSubjectMutationQuery();

  const isLoading =
    isAssessmentFormatLoading ||
    isAssessmentFormatFetching ||
    isCurrentSubjectLoading ||
    isCurrentSubjectFetching ||
    isSubjectTypeListLoading ||
    isSubjectTypeListFetching ||
    isGroupListLoading ||
    isGroupListFetching;
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset();
    if (currentSubject) {
      const { name, isActive, subjectTypeId, assessmentFormatIds } =
        currentSubject;

      setValue('name', name);
      setValue('isActive', isActive);
      setValue('subjectTypeId', subjectTypeId);
      setValue('assessmentFormatIds', assessmentFormatIds);
    } else {
      setValue('name', null);
      setValue('isActive', false);
      setValue(
        'subjectTypeId',
        subjectTypeList && subjectTypeList.data.length
          ? subjectTypeList.data[0].id
          : null
      );
    }
  }, [
    reset,
    isOpen,
    setValue,
    isLoading,
    currentSubject,
    subjectTypeList,
    assessmentFormatList,
  ]);

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isFlyoutOpen', 'false');
    params.delete('subjectId');

    router.replace(pathname + '?' + params.toString());
  };

  const saveSubject = async (payload: CreateSubjectModel) => {
    if (subjectId) {
      const updateSubjectRequestPayload = {
        ...payload,
        id: subjectId,
      };
      await mutateUpdateSubjectsAsync(updateSubjectRequestPayload);
    } else {
      const addSubjectRequestPayload = {
        ...payload,
      };
      await mutateCreateSubjectsAsync(addSubjectRequestPayload);
    }
    await closeFlyout();
  };

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeFlyout()}
        >
          {isLoading ? (
            <section className="flex h-96 w-full flex-col items-center justify-center gap-4">
              <Spinner />
              <p>Fetching Data</p>
            </section>
          ) : (
            <form onSubmit={handleSubmit(saveSubject)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        {subjectId ? 'Update Subject' : 'Add Subject'}
                      </Text>
                    </div>
                    <div className="flex items-center">
                      <Switch
                        id="isActive"
                        {...register('isActive')}
                        onCheckedChange={(value) => {
                          setValue('isActive', value);
                        }}
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
                    Subject Name
                  </label>
                  <Input
                    {...register('name')}
                    id="name"
                    autoFocus
                    required
                    type="text"
                    className="mt-2"
                    placeholder="Enter Subject Name"
                    errorMessage={fieldErrors?.name?.message.toString()}
                  />
                </div>
                <div className="pt-3">
                  <label
                    htmlFor="group"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Group
                  </label>
                  <div className="mt-2 flex flex-wrap">
                    {groupList?.data?.map((item) => (
                      <Controller
                        key={item.id}
                        control={control}
                        name="groupId"
                        render={({ field }) => {
                          return (
                            <label className="me-5">
                              <Checkbox
                                className="me-2 items-center space-x-2 rounded border border-primary-500"
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                              <span>{item.name}</span>
                            </label>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="py-4">
                  <label
                    htmlFor="description"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Subject Format
                  </label>
                  <div className="mt-2 flex flex-wrap">
                    {assessmentFormatList?.data?.map((item) => (
                      <Controller
                        key={item.id}
                        control={control}
                        name="assessmentFormatIds"
                        render={({ field }) => {
                          return (
                            <label className="me-5">
                              <Checkbox
                                className="me-2 items-center space-x-2 rounded border border-primary-500"
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                              <span>{item.name}</span>
                            </label>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="type"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Subject Type
                  </label>
                  <Select
                    autoComplete="off"
                    {...register('subjectTypeId', { required: true })}
                    value={watch('subjectTypeId')}
                    onValueChange={(value) => {
                      if (value) {
                        setValue('subjectTypeId', value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {subjectTypeList?.data?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-10">
                  <Button
                    size="lg"
                    variant="default"
                    disabled={
                      isPendingCreateSubjects || isPendingUpdateSubjects
                    }
                    aria-disabled={
                      isPendingCreateSubjects || isPendingUpdateSubjects
                    }
                    className="mx-auto flex justify-center px-12 py-4"
                  >
                    {isPendingCreateSubjects || isPendingUpdateSubjects ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                        {subjectId ? 'Updating' : 'Saving'}
                      </div>
                    ) : (
                      `${subjectId ? 'Update' : 'Save'}`
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
