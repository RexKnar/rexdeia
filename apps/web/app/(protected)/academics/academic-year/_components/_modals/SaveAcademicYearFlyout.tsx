'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, Loader2, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  AlertDescription,
  Button,
  DateSelector,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Spinner,
  Switch,
  Text,
} from 'ui';

import { useQueryParams } from '@/hooks/useQueryParams';

import { cn } from '../../../../../../../../packages/utils';
import { CreateBatchModel } from '../../../../../../lib/domain/batch';
import { useCreateBatchMutationQuery } from '../../../../../../lib/queries/batches/useCreateBatchMutationQuery';
import { useGetBatchByIdQuery } from '../../../../../../lib/queries/batches/useGetBatchByIdQuery';
import { useUpdateBatchMutationQuery } from '../../../../../../lib/queries/batches/useUpdateBatchMutationQuery';
import {
  saveBatchSchema,
  SaveBatchSchemaType,
} from '../../../../../../lib/schema/batches/saveBatchSchema';

export function SaveAcademicYearFlyout() {
  const { getParam, removeParams } = useQueryParams();

  const [endYear, setEndYear] = useState(null);
  const [startYear, setStartYear] = useState(null);

  const batchId = getParam('batchId');
  const isOpen = getParam('isFlyoutOpen') === 'true';

  const page = parseInt(getParam('page')) || 1;
  const limit = parseInt(getParam('limit')) || 10;

  const {
    reset,
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<SaveBatchSchemaType>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(saveBatchSchema),
    defaultValues: {
      name: null,
      endYear: null,
      isActive: false,
      startYear: null,
      description: null,
    },
  });

  const {
    data: currentBatch,
    isLoading: isCurrentBatchLoading,
    isFetching: isCurrentBatchFetching,
  } = useGetBatchByIdQuery(batchId, {
    enabled: !!batchId,
  });

  const {
    isPending: isPendingCreateBatches,
    mutateAsync: mutateCreateBatchesAsync,
  } = useCreateBatchMutationQuery(page, limit);

  const {
    isPending: isPendingUpdateBatches,
    mutateAsync: mutateUpdateBatchesAsync,
  } = useUpdateBatchMutationQuery(page, limit);

  useEffect(() => {
    if (currentBatch) {
      const { name, endYear, isActive, startYear } = currentBatch;

      setValue('name', name);
      setValue('isActive', isActive);
      setValue('endYear', new Date(endYear).toString());
      setValue('startYear', new Date(startYear).toString());

      setEndYear(new Date(endYear));
      setStartYear(new Date(startYear));
    } else {
      setValue('name', null);
      setValue('endYear', null);
      setValue('isActive', false);
      setValue('startYear', null);
    }
  }, [currentBatch, setValue]);

  const closeFlyout = () => {
    removeParams(['batchId', 'isFlyoutOpen']);
  };

  const saveBatch = async (payload: CreateBatchModel) => {
    try {
      if (batchId) {
        const updateBatchRequestPayload = {
          ...payload,
          id: batchId,
          endYear: endYear.getFullYear().toString(),
          startYear: startYear.getFullYear().toString(),
        };
        await mutateUpdateBatchesAsync(updateBatchRequestPayload);
      } else {
        const addBatchRequestPayload = {
          ...payload,
          endYear: endYear.getFullYear().toString(),
          startYear: startYear.getFullYear().toString(),
        };
        await mutateCreateBatchesAsync(addBatchRequestPayload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeFlyout();
      reset();
      setEndYear(null);
      setStartYear(null);
    }
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
          {isCurrentBatchLoading || isCurrentBatchFetching ? (
            <section className="flex h-96 w-full flex-col items-center justify-center gap-4">
              <Spinner />
              <p>Fetching Data</p>
            </section>
          ) : (
            <form onSubmit={handleSubmit(saveBatch)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        {batchId ? 'Update Academic year' : 'Add Academic year'}
                      </Text>
                    </div>
                    <div className="flex items-center">
                      <Switch
                        id="isActive"
                        checked={watch('isActive')}
                        {...register('isActive')}
                        onCheckedChange={(value) => setValue('isActive', value)}
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

              {fieldErrors?.refine?.message && (
                <Alert className="mb-2" variant="destructive">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertDescription>
                    <Text variant="sm-regular">
                      {fieldErrors?.refine?.message}
                    </Text>
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-5">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Academic Name
                  </label>
                  <Input
                    {...register('name', {
                      required: 'Academic Year is Required',
                    })}
                    autoFocus
                    className="mt-2"
                    placeholder="Academic Name"
                    id="name"
                    errorMessage={fieldErrors?.name?.message.toString()}
                  />
                </div>
                <div className="mt-4 flex space-x-4">
                  <div className="w-1/2">
                    <label
                      htmlFor="startYear"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Start Year
                    </label>
                    <DateSelector
                      id="startYear"
                      autoComplete="off"
                      placeholderText="Start Year"
                      {...register('startYear')}
                      onChange={(value) => {
                        setStartYear(value);
                        setValue('startYear', value.toString());
                      }}
                      showYearPicker
                      dateFormat="yyyy"
                      selected={startYear}
                    />
                    <p
                      className={cn(
                        'h-2 p-1 text-sm text-red-600',
                        fieldErrors?.startYear?.message.toString()
                          ? 'opacity-1 transition-opacity duration-300'
                          : 'opacity-0 transition-opacity duration-300'
                      )}
                    >
                      {fieldErrors?.startYear?.message.toString()}
                    </p>
                  </div>
                  <div className="w-1/2">
                    <label
                      htmlFor="endYear"
                      className="text-sm font-semibold text-gray-700"
                    >
                      End Year
                    </label>
                    <DateSelector
                      id="endYear"
                      autoComplete="off"
                      placeholderText="End Year"
                      {...register('endYear')}
                      onChange={(value) => {
                        setEndYear(value);
                        setValue('endYear', value.toString());
                      }}
                      showYearPicker
                      dateFormat="yyyy"
                      selected={endYear}
                    />
                    <p
                      className={cn(
                        'h-2 p-1 text-sm text-red-600',
                        fieldErrors?.endYear?.message.toString()
                          ? 'opacity-1 transition-opacity duration-300'
                          : 'opacity-0 transition-opacity duration-300'
                      )}
                    >
                      {fieldErrors?.endYear?.message.toString()}
                    </p>
                  </div>
                </div>
                <div className="mt-10">
                  <Button
                    size="lg"
                    variant="default"
                    disabled={isPendingCreateBatches || isPendingUpdateBatches}
                    aria-disabled={
                      isPendingCreateBatches || isPendingUpdateBatches
                    }
                    className="mx-auto flex justify-center px-12 py-4"
                  >
                    {isPendingCreateBatches || isPendingUpdateBatches ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                        {batchId ? 'Updating' : 'Saving'}
                      </div>
                    ) : (
                      `${batchId ? 'Update' : 'Save'}`
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
