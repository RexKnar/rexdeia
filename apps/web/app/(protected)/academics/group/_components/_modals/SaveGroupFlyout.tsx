'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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

import { CreateGroupModel } from '../../../../../../lib/domain/group';
import { useCreateGroupMutationQuery } from '../../../../../../lib/queries/group/useCreateGroupMutationQuery';
import { useGetGroupByIdQuery } from '../../../../../../lib/queries/group/useGetGroupByIdQuery';
import { useUpdateGroupMutationQuery } from '../../../../../../lib/queries/group/useUpdateGroupMutationQuery';

export default function SaveGroupFlyout() {
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

  const isOpen = searchParams.get('isGroupFlyoutOpen') === 'true';
  const groupId = searchParams.get('groupId');

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const {
    isPending: isPendingCreateGroup,
    mutateAsync: mutateCreateGroupAsync,
  } = useCreateGroupMutationQuery(page, limit);
  const [activeToggleFlag, setActiveToggleFlag] = useState(false);

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isGroupFlyoutOpen', 'false');
    params.delete('groupId');

    router.replace(pathname + '?' + params.toString());
  };

  const { data: getGroupByIdResponse } = useGetGroupByIdQuery(groupId, {
    enabled: !!groupId,
  });

  useEffect(() => {
    if (getGroupByIdResponse) {
      const { name, isActive } = getGroupByIdResponse;

      setValue('name', name);
      setValue('isActive', isActive);
      setActiveToggleFlag(isActive);
    } else {
      setValue('name', null);
      setValue('isActive', false);
    }
  }, [getGroupByIdResponse, setValue]);

  const {
    isPending: isPendingUpdateGroup,
    mutateAsync: mutateUpdateGroupAsync,
  } = useUpdateGroupMutationQuery(page, limit);

  async function saveGroup(payload: CreateGroupModel) {
    try {
      if (groupId) {
        const updateBatchRequestPayload = {
          ...payload,
          id: groupId,
        };
        mutateUpdateGroupAsync(updateBatchRequestPayload);
      } else {
        const requestPayload = {
          ...payload,
        };
        mutateCreateGroupAsync(requestPayload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setValue('isActive', false);
      reset();
      closeFlyout();
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
          <form onSubmit={handleSubmit(saveGroup)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      {groupId ? 'Update Group' : 'Add Group'}
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
                  Group Name
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
                  disabled={isPendingCreateGroup || isPendingUpdateGroup}
                  aria-disabled={isPendingCreateGroup || isPendingUpdateGroup}
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingCreateGroup ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Saving
                    </div>
                  ) : (
                    `${groupId ? 'Update' : 'Save'}`
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
