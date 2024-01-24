'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PlusCircle } from 'lucide-react';
import {
  parseAsBoolean,
  parseAsString,
  useQueryState,
} from 'next-usequerystate';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
  Spinner,
  Switch,
  Text,
} from 'ui';
import * as z from 'zod';

import { CreateSubjectModel } from '../../../../../lib/domain/subject';
import { useGetSubjectFormatList } from '../../../../../lib/queries/subject-format/useGetSubjectFormatList';
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
  subjectFormatId: z
    .string({
      required_error: 'Subject Format is required',
    })
    .min(1),
  isActive: z.boolean().default(true),
});

type SchemaType = z.infer<typeof schema>;

export function SaveSubjectFlyout() {
  const [isOpen, setIsOpen] = useQueryState(
    'isFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );

  const [subjectId, setSubjectId] = useQueryState('subjectId', parseAsString);

  const {
    watch,
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  const selectedActiveStatus = watch('isActive');
  const selectedSubjectTypeId = watch('subjectTypeId');
  const selectedSubjectFormatId = watch('subjectFormatId');

  const {
    data: subjectTypeList,
    isLoading: isSubjectTypeListLoading,
    isFetching: isSubjectTypeListFetching,
  } = useGetSubjectTypeList({
    page: 1,
    limit: 999,
  });

  const {
    data: subjectFormatList,
    isLoading: isSubjectFormatLoading,
    isFetching: isSubjectFormatFetching,
  } = useGetSubjectFormatList({
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
    isSubjectFormatLoading ||
    isSubjectFormatFetching ||
    isCurrentSubjectLoading ||
    isCurrentSubjectFetching ||
    isSubjectTypeListLoading ||
    isSubjectTypeListFetching;

  useEffect(() => {
    if (currentSubject) {
      const { name, isActive, subjectTypeId, subjectFormatId } = currentSubject;

      setValue('name', name);
      setValue('isActive', isActive);
      setValue('subjectTypeId', subjectTypeId);
      setValue('subjectFormatId', subjectFormatId);
    } else {
      setValue('name', null);
      setValue('isActive', true);
      setValue(
        'subjectTypeId',
        subjectTypeList && subjectTypeList.data.length
          ? subjectTypeList.data[0].id
          : null
      );
      setValue(
        'subjectFormatId',
        subjectFormatList && subjectFormatList.data.length
          ? subjectFormatList.data[0].id
          : null
      );
    }
  }, [
    isOpen,
    setValue,
    isLoading,
    currentSubject,
    subjectTypeList,
    subjectFormatList,
  ]);

  const closeFlyout = async () => {
    await setIsOpen(false);
    await setSubjectId(null);
  };

  const saveSubject = async (payload: CreateSubjectModel) => {
    try {
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
    } catch (error) {
      console.error(error);
    } finally {
      reset();
      await closeFlyout();
    }
  };

  const onSubjectTypeChange = useCallback(
    (value: string) => {
      setValue('subjectTypeId', value);
    },
    [setValue]
  );

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
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
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
                        checked={selectedActiveStatus}
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
                    {...register('name', {
                      required: 'name is Required',
                    })}
                    id="name"
                    autoFocus
                    type="text"
                    className="mt-2"
                    placeholder="Enter Subject Name"
                    errorMessage={fieldErrors?.name?.message.toString()}
                  />
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
                    value={selectedSubjectTypeId}
                    onValueChange={onSubjectTypeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue {...register('subjectTypeId')} />
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
                <div>
                  <label
                    htmlFor="description"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Subject Format
                  </label>
                  <Select
                    value={selectedSubjectFormatId}
                    onValueChange={(value) => {
                      setValue('subjectFormatId', value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue {...register('subjectFormatId')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {subjectFormatList?.data?.map((item) => (
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
