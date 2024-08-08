'use client';

import { CreateClassLevelModel } from 'lib/domain/classLevel';
import { useCreateClassLevelMutationQuery } from 'lib/queries/classLevel/useCreateClassLevelMutationQuery';
import { PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import React, { useEffect } from 'react';
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

import { useQueryParams } from '@/hooks/useQueryParams';

// import { useCreateExamTypeMutationQuery } from '../../../../../lib/queries/examtype/useCreateExamTypeMutationQuery';
// import { useGetExamTypeByIdQuery } from '../../../../../lib/queries/examtype/useGetExamTypeByIdQuery';
// import { useUpdateExamTypeMutationQuery } from '../../../../../lib/queries/examtype/useUpdateExamTypeMutationQuery';

export function SaveClassLevelFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getParam } = useQueryParams();
  const page = parseInt(getParam('page')) || 1;
  const limit = parseInt(getParam('limit')) || 10;

  // const classLevelId = searchParams.get('classLevelId');
  const isOpen = searchParams.get('SaveClassLevelFlyout') === 'true';
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
    // isPending: isPendingCreateClassLevel,
    mutateAsync: mutateCreateClassLevelAsync,
  } = useCreateClassLevelMutationQuery(page, limit);

  // const { data: getClassLevelByIdResponse } = useGetClassLevelByIdQuery(
  //   classLevelId,
  //   {
  //     enabled: !!classLevelId,
  //   }
  // );

  // useEffect(() => {
  //   if (getClassLevelByIdResponse) {
  //     const { name, isActive} = getClassLevelByIdResponse;
  //     setValue('name', name);
  //     setValue('isActive', isActive);
  //   } else {
  //     setValue('name', null);
  //     setValue('isActive', false);
  //   }
  // }, [getClassLevelByIdResponse, setValue]);

  // const {
  //   isPending: isPendingUpdateExamType,
  //   mutateAsync: mutateUpdateExamTypeAsync,
  // } = useUpdateExamTypeMutationQuery({ page, limit });

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('SaveClassLevelFlyout', 'false');
    params.delete('classLevelId');
    router.replace(pathname + '?' + params.toString());
  };

  async function saveClassLevel(payload: CreateClassLevelModel) {
    try {
      // if (classLevelId) {
      //   const updateExamTypeRequestPayload = {
      //     ...payload,
      //     id: classLevelId,
      //   };
      //   await mutateUpdateExamTypeAsync(updateExamTypeRequestPayload);
      // }

      const requestPayload = {
        ...payload,
      };
      await mutateCreateClassLevelAsync(requestPayload);
    } catch (error) {
      console.error(error);
    } finally {
      closeFlyout();
      setValue('isActive', false);
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
          <form onSubmit={handleSubmit(saveClassLevel)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      {'Add Class Level'}
                      {/* {examTypeId ? 'Update ExamType' : 'Add Exam Type'} */}
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
            <div className="mt-10">
              <Button
                size="lg"
                variant="default"
                // disabled={isPendingCreateExamType || isPendingUpdateExamType}
                // aria-disabled={
                //   isPendingCreateExamType || isPendingUpdateExamType
                // }
                className="mx-auto flex justify-center px-12 py-4"
              >
                {/* {isPendingCreateExamType ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                  Saving
                </div>
                ) : (
                  `${classLevelId ? 'Update' : 'Save'}`
                )} */}
                Save
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
