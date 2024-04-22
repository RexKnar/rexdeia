'use client';

import { CreateSubjectMasterModel } from 'lib/domain/subject';
import { useCreateSubjectMasterMutationQuery } from 'lib/queries/subject-master/useCreateSubjectMasterMutationQuery';
import { useGetSubjectMasterByIdQuery } from 'lib/queries/subject-master/useGetSubjectMasterByIdQuery';
import { useUpdateSubjectMasterMutationQuery } from 'lib/queries/subject-master/useUpdateSubjectMasterMutationQuery';
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

export function SaveSubjectMasterFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const isOpen = searchParams.get('isSubjectMasterFlyoutOpen') === 'true';
  const subjectMasterId = searchParams.get('subjectMasterId');

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const filter = {};
  const {
    isPending: isPendingCreateSubjectMaster,
    mutateAsync: mutateCreateSubjectMasterAsync,
  } = useCreateSubjectMasterMutationQuery({
    page,
    limit,
    filter,
  });

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isSubjectMasterFlyoutOpen', 'false');
    params.delete('subjectMasterId');

    router.replace(pathname + '?' + params.toString());
    reset();
  };

  const { data: getSubjectMasterByIdResponse } = useGetSubjectMasterByIdQuery(
    subjectMasterId,
    {
      enabled: !!subjectMasterId,
    }
  );

  useEffect(() => {
    if (getSubjectMasterByIdResponse) {
      const { name, isActive } = getSubjectMasterByIdResponse;

      setValue('name', name);
      setValue('isActive', isActive);
    } else {
      setValue('name', null);
      setValue('isActive', false);
    }
  }, [getSubjectMasterByIdResponse, setValue]);

  const {
    isPending: isPendingUpdateSubjectMaster,
    mutateAsync: mutateUpdateSubjectMasterAsync,
  } = useUpdateSubjectMasterMutationQuery({
    page,
    limit,
    filter,
  });

  async function saveSubjectMaster(payload: CreateSubjectMasterModel) {
    try {
      if (subjectMasterId) {
        const updateBatchRequestPayload = {
          ...payload,
          id: subjectMasterId,
        };
        await mutateUpdateSubjectMasterAsync(updateBatchRequestPayload);
      } else {
        const requestPayload = {
          ...payload,
        };
        await mutateCreateSubjectMasterAsync(requestPayload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setValue('isActive', false);
      closeFlyout();
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
          onCloseClick={() => closeFlyout()}
        >
          <form onSubmit={handleSubmit(saveSubjectMaster)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      {subjectMasterId
                        ? 'Update Subject Master'
                        : 'Add Subject Master'}
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
                  Subject Master Name
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
                  disabled={
                    isPendingCreateSubjectMaster || isPendingUpdateSubjectMaster
                  }
                  aria-disabled={
                    isPendingCreateSubjectMaster || isPendingUpdateSubjectMaster
                  }
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingCreateSubjectMaster ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Saving
                    </div>
                  ) : (
                    `${subjectMasterId ? 'Update' : 'Save'}`
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
