'use client';

import { PlusCircle } from 'lucide-react';
import {
  parseAsBoolean,
  parseAsInteger,
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

import { CreateSubjectModel } from '../../../../../lib/domain/subject';
import { useCreateSubjectMutationQuery } from '../../../../../lib/queries/subjects/useCreateSubjectMutationQuery';

export function SaveSubjectFlyout() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: null,
      type: null,
      description: null,
      isActive: false,
      subjectName: null,
    },
  });

  const [isOpen, setIsOpen] = useQueryState(
    'isFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit] = useQueryState('limit', parseAsInteger.withDefault(10));

  const {
    isPending: isPendingCreateSubjects,
    mutateAsync: mutateSubjectsAsync,
  } = useCreateSubjectMutationQuery(page, limit);
  const [activeToggleFlag, setActiveToggleFlag] = useState(false);

  const closeFlyout = async () => {
    await setIsOpen(false);
  };
  async function saveSubject(payload: CreateSubjectModel) {
    try {
      const requestPayload = {
        ...payload,
      };
      mutateSubjectsAsync(requestPayload);
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
          <form onSubmit={handleSubmit(saveSubject)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Add Subject
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
                  Subject Name
                </label>
                <Input
                  {...register('name', {
                    required: 'name is Required',
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
                  htmlFor="type"
                  className="text-sm font-semibold text-gray-700"
                >
                  Subject Type
                </label>
                <Input
                  {...register('type', {
                    required: 'Subject type is Required',
                  })}
                  className="mt-2"
                  id="type"
                />
                <p
                  className={`h-2 p-1 text-sm text-red-600 ${
                    fieldErrors.type
                      ? 'opacity-100 transition-opacity duration-300'
                      : 'opacity-0 transition-opacity duration-300'
                  }`}
                >
                  {fieldErrors.type?.message as string}
                </p>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-gray-700"
                >
                  Subject Description
                </label>
                <Input
                  {...register('description', {
                    required: 'Subject Description is Required',
                  })}
                  className="mt-2"
                  id="description"
                />
                <p
                  className={`h-2 p-1 text-sm text-red-600 ${
                    fieldErrors.description
                      ? 'opacity-100 transition-opacity duration-300'
                      : 'opacity-0 transition-opacity duration-300'
                  }`}
                >
                  {fieldErrors.description?.message as string}
                </p>
              </div>

              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  disabled={isPendingCreateSubjects}
                  aria-disabled={isPendingCreateSubjects}
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  <div className="flex items-center justify-center">Save</div>
                </Button>
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
