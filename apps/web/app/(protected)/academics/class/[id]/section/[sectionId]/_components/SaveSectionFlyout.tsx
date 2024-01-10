'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import {
  parseAsBoolean,
  parseAsString,
  useQueryState,
} from 'next-usequerystate';
import { useState } from 'react';
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
import { cn } from 'utils';

import { CreateSectionModel } from '../../../../../../../../lib/domain/section';
import { useCreateSectionMutationQuery } from '../../../../../../../../lib/queries/section/useCreateSectionMutationQuery';

function SaveSectionFlyout() {
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
      medium: null,
      isActive: false,
      department: null,
    },
  });
  const [isOpen, setIsOpen] = useQueryState(
    'isSectionFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );
  const [classId, setClassId] = useQueryState('classId', parseAsString);
  const [activeToggleFlag, setActiveToggleFlag] = useState(false);
  const closeFlyout = async () => {
    await setIsOpen(false);
    setClassId(null);
  };
  const {
    isPending: isPendingCreateSection,
    mutateAsync: mutateCreateSectionAsync,
  } = useCreateSectionMutationQuery();
  const saveSection = async (payload: CreateSectionModel) => {
    try {
      const addSectionPayload = {
        ...payload,
        classId,
      };
      mutateCreateSectionAsync(addSectionPayload);
    } catch (error) {
      console.error(error);
    } finally {
      reset();
      await closeFlyout();
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
          <form onSubmit={handleSubmit(saveSection)}>
            <SheetHeader>
              <SheetTitle>
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      New Section
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
                  htmlFor="regulationName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Section Name
                </label>
                <Input
                  className="mt-2"
                  {...register('name', {
                    required: 'Section Name is Required',
                  })}
                  id="name"
                />
              </div>
              <p
                className={cn(
                  'h-2 p-1 text-sm text-red-600',
                  fieldErrors.name
                    ? 'opacity-100 transition-opacity duration-300'
                    : 'opacity-0 transition-opacity duration-300'
                )}
              >
                {fieldErrors.name?.message as string}
              </p>
              <div className="mt-2">
                <label
                  htmlFor="regulationName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Medium
                </label>
                <Input
                  className="mt-2"
                  {...register('medium', {
                    required: 'Medium is Required',
                  })}
                  id="medium"
                />
                <p
                  className={cn(
                    'h-2 p-1 text-sm text-red-600',
                    fieldErrors.medium
                      ? 'opacity-100 transition-opacity duration-300'
                      : 'opacity-0 transition-opacity duration-300'
                  )}
                >
                  {fieldErrors.medium?.message as string}
                </p>
              </div>
              <div className="mt-2">
                <label
                  htmlFor="regulationName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Department
                </label>
                <Input
                  className="mt-2"
                  {...register('department', {
                    required: 'Medium is Required',
                  })}
                  id="department"
                />
                <p
                  className={cn(
                    'h-2 p-1 text-sm text-red-600',
                    fieldErrors.department
                      ? 'opacity-100 transition-opacity duration-300'
                      : 'opacity-0 transition-opacity duration-300'
                  )}
                >
                  {fieldErrors.department?.message as string}
                </p>
              </div>
              <div className="mt-10 flex">
                <Button
                  size="lg"
                  variant="default"
                  type="submit"
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingCreateSection ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Saving
                    </div>
                  ) : (
                    'Save'
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

export default SaveSectionFlyout;
