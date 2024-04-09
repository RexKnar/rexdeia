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

import { CreateTermModel } from 'lib/domain/term';
import { useCreateTermMutationQuery } from 'lib/queries/term/useCreateTermMutationQuery';
import { useGetTermByIdQuery } from 'lib/queries/term/useGetTermByIdQuery';
import { useUpdateTermMutationQuery } from 'lib/queries/term/useUpdateTermMutationQuery';

export function SaveTermFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const termId = searchParams.get('termId');
  const isOpen = searchParams.get('isTermFlyoutOpen') === 'true';

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

  const { isPending: isPendingCreateTerm, mutateAsync: mutateCreateTermAsync } =
    useCreateTermMutationQuery();

  const closeTermFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isTermFlyoutOpen', 'false');
    params.delete('termId');
    reset();
    router.replace(pathname + '?' + params.toString());
  };

  const { data: getTermByIdResponse } = useGetTermByIdQuery(termId, {
    enabled: !!termId,
  });

  useEffect(() => {
    if (getTermByIdResponse) {
      const { name, isActive } = getTermByIdResponse;

      setValue('name', name);
      setValue('isActive', isActive);
    } else {
      setValue('name', null);
      setValue('isActive', false);
    }
  }, [getTermByIdResponse, setValue]);

  const { isPending: isPendingUpdateTerm, mutateAsync: mutateUpdateTermAsync } =
    useUpdateTermMutationQuery();

  async function saveTerm(payload: CreateTermRequestModel) {
    try {
      if (termId) {
        const updateBatchRequestPayload = {
          ...payload,
          id: termId,
        };
        await mutateUpdateTermAsync(updateBatchRequestPayload);
      } else {
        const requestPayload = {
          ...payload,
        };
        await mutateCreateTermAsync(requestPayload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setValue('isActive', false);
      await closeTermFlyout();
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
          onCloseClick={() => closeTermFlyout()}
        >
          <form onSubmit={handleSubmit(saveTerm)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      {termId ? 'Update Term' : 'Add Term'}
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
                  Term Name
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
                  disabled={isPendingCreateTerm || isPendingUpdateTerm}
                  aria-disabled={isPendingCreateTerm || isPendingUpdateTerm}
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingCreateTerm ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Saving
                    </div>
                  ) : (
                    `${termId ? 'Update' : 'Save'}`
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
