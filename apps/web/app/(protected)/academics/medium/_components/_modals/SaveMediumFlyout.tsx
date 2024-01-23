'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'next-usequerystate';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Switch,
  Text,
} from 'ui';

import { CreateMediumModel } from '../../../../../../lib/domain/medium';
import { useCreateMediumMutationQuery } from '../../../../../../lib/queries/medium/useCreateMediumMutationQuery';
import { useGetMediumByIdQuery } from '../../../../../../lib/queries/medium/useGetMediumByIdQuery';
import { useUpdateMediumMutationQuery } from '../../../../../../lib/queries/medium/useUpdateMediumMutationQuery';

export default function SaveMediumFlyout() {
  const {
    register,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: null,
      isActive: false,
    },
  });

  const [isOpen, setIsOpen] = useQueryState(
    'isMediumFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );
  const [mediumId, setMediumId] = useQueryState('mediumId', parseAsString);

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit] = useQueryState('limit', parseAsInteger.withDefault(10));

  const {
    isPending: isPendingCreateMedium,
    mutateAsync: mutateCreateMediumAsync,
  } = useCreateMediumMutationQuery(page, limit);
  const [activeToggleFlag, setActiveToggleFlag] = useState(false);

  const closeMediumFlyout = async () => {
    await setIsOpen(false);
    await setMediumId(null);
  };

  const { data: getMediumByIdResponse } = useGetMediumByIdQuery(mediumId, {
    enabled: !!mediumId,
  });

  useEffect(() => {
    if (getMediumByIdResponse) {
      const { name, isActive } = getMediumByIdResponse;

      setValue('name', name);
      setValue('isActive', isActive);
      setActiveToggleFlag(isActive);
    } else {
      setValue('name', null);
      setValue('isActive', false);
    }
  }, [getMediumByIdResponse, setValue]);

  const {
    isPending: isPendingUpdateMedium,
    mutateAsync: mutateUpdateMediumAsync,
  } = useUpdateMediumMutationQuery(page, limit);

  async function saveMedium(payload: CreateMediumModel) {
    try {
      if (mediumId) {
        const updateBatchRequestPayload = {
          ...payload,
          id: mediumId,
        };
        mutateUpdateMediumAsync(updateBatchRequestPayload);
      } else {
        const requestPayload = {
          ...payload,
        };
        mutateCreateMediumAsync(requestPayload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setValue('isActive', false);
      reset();
      closeMediumFlyout();
    }
  }

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeMediumFlyout()}
        >
          <form onSubmit={handleSubmit(saveMedium)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      {mediumId ? 'Update Medium' : 'Add Medium'}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      id="isActive"
                      {...register('isActive')}
                      onCheckedChange={(value) => {
                        setValue('isActive', value);
                        setActiveToggleFlag(value);
                      }}
                      checked={activeToggleFlag}
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
                  Medium Name
                </label>
                <Input
                  {...register('name', {
                    required: 'name is Required',
                  })}
                  className="mt-2"
                  id="name"
                />
                <p>{fieldErrors.name?.message as string}</p>
              </div>
              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  disabled={isPendingCreateMedium || isPendingUpdateMedium}
                  aria-disabled={isPendingCreateMedium || isPendingUpdateMedium}
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingCreateMedium ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Saving
                    </div>
                  ) : (
                    `${mediumId ? 'Update' : 'Save'}`
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
