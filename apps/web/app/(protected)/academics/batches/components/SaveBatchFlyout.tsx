'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'next-usequerystate';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  DateSelector,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Switch,
  Text,
} from 'ui';

import { CreateBatchModel } from '../../../../../lib/domain/batch';
import { useCreateBatchMutationQuery } from '../../../../../lib/queries/batches/useCreateBatchMutationQuery';

export function SaveBatchFlyout() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors: fieldErrors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: null,
      endYear: null,
      isActive: false,
      startYear: null,
      description: null,
    },
  });

  const [endYear, setEndYear] = useState(new Date());
  const [startYear, setStartYear] = useState(new Date());
  const [isOpen, setIsOpen] = useQueryState(
    'isFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );
  const [batchId, setBatchId] = useQueryState('batchId', parseAsString);

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit] = useQueryState('limit', parseAsInteger.withDefault(10));

  const {
    isPending: isPendingCreateBatches,
    mutateAsync: mutateCreateBatchesAsync,
  } = useCreateBatchMutationQuery(page, limit);

  const closeFlyout = async () => {
    await setIsOpen(false);
    await setBatchId(null);
  };

  async function addBatch(payload: CreateBatchModel) {
    try {
      const batchRequestPayload = {
        ...payload,
        endYear: endYear.getFullYear().toString(),
        startYear: startYear.getFullYear().toString(),
      };
      mutateCreateBatchesAsync(batchRequestPayload);
    } catch (error) {
      console.error(error);
    } finally {
      reset();
      await closeFlyout();
    }
  }

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeFlyout()}
        >
          <form onSubmit={handleSubmit(addBatch)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      {batchId ? 'Update Batch' : 'Add Batch'}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      id="isActive"
                      {...register('isActive')}
                      onCheckedChange={(value) => {
                        setValue('isActive', value);
                      }}
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
                  Batch Name
                </label>
                <Input
                  {...register('name', {
                    required: 'Batch Name is Required',
                  })}
                  className="mt-2"
                  id="name"
                />
                <p
                  className={`h-2 p-1 text-sm text-red-600 ${
                    fieldErrors.name
                      ? 'opacity-100 transition-opacity duration-300'
                      : 'opacity-0 transition-opacity duration-300'
                  }`}
                >
                  {fieldErrors.name?.message as string}
                </p>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Batch Description
                </label>
                <Input
                  {...register('description')}
                  className="mt-2"
                  id="name"
                />
              </div>
              <div>
                <label
                  htmlFor="startYear"
                  className="text-sm font-semibold text-gray-700"
                >
                  Start Year
                </label>
                <DateSelector
                  id="startYear"
                  {...register('startYear')}
                  onChange={(value) => {
                    setStartYear(value);
                    setValue('startYear', value);
                  }}
                  showYearPicker
                  dateFormat="yyyy"
                  selected={startYear}
                />
              </div>
              <div>
                <label
                  htmlFor="endYear"
                  className="text-sm font-semibold text-gray-700"
                >
                  End Year
                </label>
                <DateSelector
                  id="endYear"
                  {...register('endYear')}
                  onChange={(value) => {
                    setEndYear(value);
                    setValue('endYear', value);
                  }}
                  showYearPicker
                  dateFormat="yyyy"
                  selected={endYear}
                />
              </div>
              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  disabled={isPendingCreateBatches}
                  aria-disabled={isPendingCreateBatches}
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingCreateBatches ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Saving
                    </div>
                  ) : (
                    `${batchId ? 'Update' : 'Save'}`
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
