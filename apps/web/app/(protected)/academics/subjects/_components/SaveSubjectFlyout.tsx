'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'next-usequerystate';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Spinner,
  Switch,
  Text,
} from 'ui';

import { CreateSubjectModel } from '../../../../../lib/domain/subject';
import { useGetBatchByIdQuery } from '../../../../../lib/queries/batches/useGetBatchByIdQuery';
import { useCreateSubjectMutationQuery } from '../../../../../lib/queries/subjects/useCreateSubjectMutationQuery';
import { useUpdateSubjectMutationQuery } from '../../../../../lib/queries/subjects/useUpdateSubjectMutationQuery';

export function SaveSubjectFlyout() {
  const [isOpen, setIsOpen] = useQueryState(
    'isFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );
  const [subjectId, setSubjectId] = useQueryState('subjectId', parseAsString);
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit] = useQueryState('limit', parseAsInteger.withDefault(10));
  const [activeToggleFlag, setActiveToggleFlag] = useState(false);

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
      subjectTypeId: null,
      subjectFormatId: null,
      description: null,
      isActive: false,
      subjectName: null,
    },
  });

  const {
    data: currentSubject,
    isLoading: isCurrentSubjectLoading,
    isFetching: isCurrentSubjectFetching,
  } = useGetBatchByIdQuery(subjectId, {
    enabled: !!subjectId,
  });

  const {
    isPending: isPendingCreateSubjects,
    mutateAsync: mutateCreateSubjectsAsync,
  } = useCreateSubjectMutationQuery(page, limit);
  const {
    isPending: isPendingUpdateSubjects,
    mutateAsync: mutateUpdateSubjectsAsync,
  } = useUpdateSubjectMutationQuery(page, limit);

  useEffect(() => {
    if (currentSubject) {
      const { name, isActive, description } = currentSubject;

      setValue('name', name);
      setValue('isActive', isActive);
      setValue('description', description);
      setActiveToggleFlag(isActive);
    } else {
      setValue('name', null);
      setValue('isActive', false);
      setValue('description', null);
    }
  }, [currentSubject, setValue]);

  const closeFlyout = async () => {
    await setIsOpen(false);
    await setSubjectId(null);
  };

  const saveSubject = async (payload: CreateSubjectModel) => {
    try {
      if (subjectId) {
        const updateSubjectRequestPayload = {
          ...payload,
          id: subjectId,
        };
        mutateUpdateSubjectsAsync(updateSubjectRequestPayload);
      } else {
        const addSubjectRequestPayload = {
          ...payload,
        };
        mutateCreateSubjectsAsync(addSubjectRequestPayload);
      }
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
          {isCurrentSubjectLoading || isCurrentSubjectFetching ? (
            <section className="flex h-96 w-full flex-col items-center justify-center gap-4">
              <Spinner />
              <p>Fetching Data</p>
            </section>
          ) : (
            <form onSubmit={handleSubmit(saveSubject)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        {subjectId ? 'Update Subject' : 'Add Subject'}
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
                    errorMessage={fieldErrors?.name?.message.toString()}
                  />
                </div>
                <div>
                  <label
                    htmlFor="type"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Subject Type
                  </label>
                  <Input
                    {...register('subjectTypeId', {
                      required: 'Subject type is Required',
                    })}
                    className="mt-2"
                    id="type"
                    errorMessage={fieldErrors?.subjectTypeId?.message.toString()}
                  />
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
                    errorMessage={fieldErrors?.description?.message.toString()}
                  />
                </div>

                <div className="mt-10">
                  <Button
                    size="lg"
                    variant="default"
                    disabled={
                      isPendingCreateSubjects || isPendingUpdateSubjects
                    }
                    aria-disabled={
                      isPendingCreateSubjects || isPendingUpdateSubjects
                    }
                    className="mx-auto flex justify-center px-12 py-4"
                  >
                    {isPendingCreateSubjects || isPendingUpdateSubjects ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                        Saving
                      </div>
                    ) : (
                      `${subjectId ? 'Update' : 'Save'}`
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
