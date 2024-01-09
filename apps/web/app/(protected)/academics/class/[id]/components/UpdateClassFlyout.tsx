'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { parseAsBoolean, useQueryState } from 'next-usequerystate';
import { useEffect, useState } from 'react';
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

import { UpdateClassModel } from '../../../../../../lib/domain/class';
import { useUpdateClassMutationQuery } from '../../../../../../lib/queries/class/use UpdateClassMutationQuery';
import { useGetClassByIdQuery } from '../../../../../../lib/queries/class/useGetClassByIdQuery';

export function UpdateClassFlyout() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      isActive: false,
      name: null,
    },
  });

  const [isOpen, setIsOpen] = useQueryState(
    'isUpdateClassFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );
  const params = useParams<{ id: string }>();

  const [activeToggleFlag, setActiveToggleFlag] = useState(false);

  const { data: geClassByIdResponse } = useGetClassByIdQuery(params.id, {
    enabled: !!params.id,
  });
  useEffect(() => {
    if (geClassByIdResponse) {
      const { name, isActive } = geClassByIdResponse;

      setValue('name', name);
      setValue('isActive', isActive);
      setActiveToggleFlag(isActive);
    } else {
      setValue('name', null);
      setValue('isActive', false);
    }
  }, [geClassByIdResponse, setValue]);

  const {
    isPending: isPendingUpdateClass,
    mutateAsync: mutateUpdateClassAsync,
  } = useUpdateClassMutationQuery(params.id);

  async function updateClass(payload: UpdateClassModel) {
    try {
      const updateClassPayload = {
        ...payload,
        id: params.id,
      };
      mutateUpdateClassAsync(updateClassPayload);
    } catch (error) {
      console.error(error);
    } finally {
      setValue('isActive', false);
      reset();
      await setIsOpen(false);
    }
  }

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={async () => {
            await setIsOpen(false);
          }}
        >
          <form onSubmit={handleSubmit(updateClass)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Update Regulation
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
                  Class Name
                </label>
                <Input
                  {...register('name', {
                    required: 'Class Name is Required',
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
              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  disabled={isPendingUpdateClass}
                  aria-disabled={isPendingUpdateClass}
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingUpdateClass ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Updating
                    </div>
                  ) : (
                    'Update'
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
