'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
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

import { CreateMediumRequestModel } from '../../../../../lib/domain/medium';
import { useCreateMediumMutationQuery } from '../../../../../lib/queries/medium/useCreateMediumMutationQuery';
import { useGetMediumByIdQuery } from '../../../../../lib/queries/medium/useGetMediumByIdQuery';
import { useUpdateMediumMutationQuery } from '../../../../../lib/queries/medium/useUpdateMediumMutationQuery';

export function SaveMediumFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mediumId = searchParams.get('mediumId');
  const isOpen = searchParams.get('isMediumFlyoutOpen') === 'true';

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

  const {
    isPending: isPendingCreateMedium,
    mutateAsync: mutateCreateMediumAsync,
  } = useCreateMediumMutationQuery();

  const closeMediumFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isMediumFlyoutOpen', 'false');
    params.delete('mediumId');
    router.replace(pathname + '?' + params.toString());
  };

  const { data: getMediumByIdResponse } = useGetMediumByIdQuery(mediumId, {
    enabled: !!mediumId,
  });

  useEffect(() => {
    if (getMediumByIdResponse) {
      const { name, isActive } = getMediumByIdResponse;

      setValue('name', name);
      setValue('isActive', isActive);
    } else {
      setValue('name', null);
      setValue('isActive', false);
    }
  }, [getMediumByIdResponse, setValue]);

  const {
    isPending: isPendingUpdateMedium,
    mutateAsync: mutateUpdateMediumAsync,
  } = useUpdateMediumMutationQuery();

  async function saveMedium(payload: CreateMediumRequestModel) {
    try {
      if (mediumId) {
        const updateBatchRequestPayload = {
          ...payload,
          id: mediumId,
        };
        await mutateUpdateMediumAsync(updateBatchRequestPayload);
      } else {
        const requestPayload = {
          ...payload,
        };
        await mutateCreateMediumAsync(requestPayload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setValue('isActive', false);
      closeMediumFlyout();
      reset();
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
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
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
                  Medium Name
                </label>
                <Input
                  {...register('name', {
                    required: 'name is Required',
                  })}
                  autoFocus
                  className="mt-2"
                  id="name"
                  errorMessage={fieldErrors?.name?.message.toString()}
                />
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
