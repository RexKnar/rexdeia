'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
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
  Switch,
  Text,
} from 'ui';

import { useQueryParams } from '@/hooks/useQueryParams';

import { CreateExamTypeModel } from '../../../../../lib/domain/exam';
import { useCreateExamTypeMutationQuery } from '../../../../../lib/queries/examtype/useCreateExamTypeMutationQuery';
import { useGetExamTypeByIdQuery } from '../../../../../lib/queries/examtype/useGetExamTypeByIdQuery';
import { useUpdateExamTypeMutationQuery } from '../../../../../lib/queries/examtype/useUpdateExamTypeMutationQuery';

export function SaveExamTypeFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getParam } = useQueryParams();
  const page = parseInt(getParam('page')) || 1;
  const limit = parseInt(getParam('limit')) || 10;

  const examTypeId = searchParams.get('examTypeId');
  const isOpen = searchParams.get('isExamTypeFlyoutOpen') === 'true';
  const {
    reset,
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: null,
      isActive: false,
      frequencyId: null,
    },
  });

  const {
    isPending: isPendingCreateExamType,
    mutateAsync: mutateCreateExamTypeAsync,
  } = useCreateExamTypeMutationQuery({ page, limit });

  const { data: getExamTypeByIdResponse } = useGetExamTypeByIdQuery(
    examTypeId,
    {
      enabled: !!examTypeId,
    }
  );

  useEffect(() => {
    if (getExamTypeByIdResponse) {
      const { name, isActive, frequencyId } = getExamTypeByIdResponse;

      setValue('name', name);
      setValue('isActive', isActive);
      setValue('frequencyId', frequencyId);
    } else {
      setValue('name', null);
      setValue('isActive', false);
      setValue('frequencyId', null);
    }
  }, [getExamTypeByIdResponse, setValue]);

  const {
    isPending: isPendingUpdateExamType,
    mutateAsync: mutateUpdateExamTypeAsync,
  } = useUpdateExamTypeMutationQuery({ page, limit });

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isExamTypeFlyoutOpen', 'false');
    params.delete('examTypeId');
    router.replace(pathname + '?' + params.toString());
  };

  async function saveExamType(payload: CreateExamTypeModel) {
    try {
      if (examTypeId) {
        const updateExamTypeRequestPayload = {
          ...payload,
          id: examTypeId,
        };
        await mutateUpdateExamTypeAsync(updateExamTypeRequestPayload);
      } else {
        const requestPayload = {
          ...payload,
        };
        await mutateCreateExamTypeAsync(requestPayload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeFlyout();
      setValue('isActive', false);
      reset();
    }
  }
  const frequency = [
    {
      id: '1',
      label: 'Once a Week',
      value: 'weekly',
    },
    {
      id: '2',
      label: 'Once a Month',
      value: 'monthly',
    },
    {
      id: '3',
      label: 'Once a Term',
      value: 'termly',
    },
    {
      id: '4',
      label: 'Twice a Term',
      value: 'bi-termly',
    },
  ];
  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeFlyout()}
        >
          <form onSubmit={handleSubmit(saveExamType)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      {examTypeId ? 'Update ExamType' : 'Add Exam Type'}
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
                  Exam Type Name
                </label>
                <Input
                  {...register('name', {
                    required: 'Name is Required',
                  })}
                  autoFocus
                  className="mt-2"
                  id="name"
                  errorMessage={fieldErrors?.name?.message.toString()}
                />
              </div>
            </div>
            <div className="mt-2">
              <label
                htmlFor="frequency"
                className="text-sm font-semibold text-gray-700"
              >
                Frequency
              </label>
              <div className="mt-2">
                <Select
                  autoComplete="off"
                  value={watch('frequencyId')}
                  {...register('frequencyId')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('frequencyId', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      {...register('frequencyId', {
                        required: 'Frequency is required',
                      })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {frequency.map((item, index) => (
                        <SelectItem value={item.id} key={index}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-10">
              <Button
                size="lg"
                variant="default"
                disabled={isPendingCreateExamType || isPendingUpdateExamType}
                aria-disabled={
                  isPendingCreateExamType || isPendingUpdateExamType
                }
                className="mx-auto flex justify-center px-12 py-4"
              >
                {isPendingCreateExamType ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                    Saving
                  </div>
                ) : (
                  `${examTypeId ? 'Update' : 'Save'}`
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
