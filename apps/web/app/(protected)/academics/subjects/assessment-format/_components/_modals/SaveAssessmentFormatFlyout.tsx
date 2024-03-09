'use client';

import { useGetAssessmentFormatList } from 'lib/queries/assessment-format/useGetAssessmentFormatList';
import { Loader2, PlusCircle } from 'lucide-react';
import { useEffect } from 'react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Spinner,
  Switch,
  Text,
} from 'ui';

import { useQueryParams } from '@/hooks/useQueryParams';

import { CreateAssessmentFormatModel } from '../../../../../../../lib/domain/subject';
import { useCreateAssessmentFormatMutationQuery } from '../../../../../../../lib/queries/assessment-format/useCreateAssessmentFormatMutationQuery';
import { useGetAssessmentFormatByIdQuery } from '../../../../../../../lib/queries/assessment-format/useGetAssessmentFormatByIdQuery';
import { useUpdateAssessmentFormatMutationQuery } from '../../../../../../../lib/queries/assessment-format/useUpdateAssessmentFormatMutationQuery';
import { SaveAssessmentSchemaType } from '../../../../../../../lib/schema/assessment-format/saveAssessmentFormat';

export function SaveAssessmentFormatFlyout() {
  const { getParam, removeParams } = useQueryParams();

  const assessmentFormatId = getParam('assessmentFormatId');
  const isOpen = getParam('isAssessmentFormatFlyoutOpen') === 'true';

  const page = parseInt(getParam('page')) || 1;
  const limit = parseInt(getParam('limit')) || 999;

  const {
    reset,
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<SaveAssessmentSchemaType>({
    defaultValues: {
      name: '',
      isActive: false,
      parentId: null,
      hasMarkEntry: false,
    },
  });

  const {
    data: assessmentFormatListResponse,
    isLoading: isAssessmentFormatListLoading,
  } = useGetAssessmentFormatList({
    page,
    limit,
  });

  const {
    isPending: isPendingCreateAssessmentFormat,
    mutateAsync: mutateCreateAssessmentFormatAsync,
  } = useCreateAssessmentFormatMutationQuery();

  const { data: getAssessmentFormatByIdResponse } =
    useGetAssessmentFormatByIdQuery(assessmentFormatId, {
      enabled: !!assessmentFormatId,
    });

  useEffect(() => {
    if (getAssessmentFormatByIdResponse) {
      const { name, isActive, parentId, hasMarkEntry } =
        getAssessmentFormatByIdResponse;

      setValue('name', name);
      setValue('isActive', isActive);
      setValue('parentId', parentId);
      setValue('hasMarkEntry', hasMarkEntry);
    } else {
      setValue('name', null);
      setValue('isActive', false);
      setValue('parentId', null);
      setValue('hasMarkEntry', false);
    }
  }, [getAssessmentFormatByIdResponse, setValue]);

  const {
    isPending: isPendingUpdateAssessmentFormat,
    mutateAsync: mutateUpdateAssessmentFormatAsync,
  } = useUpdateAssessmentFormatMutationQuery(page, limit);

  async function saveAssessmentFormat(payload: CreateAssessmentFormatModel) {
    try {
      if (assessmentFormatId) {
        const updateAssessmentFormatRequestPayload = {
          ...payload,
          id: assessmentFormatId,
        };
        await mutateUpdateAssessmentFormatAsync(
          updateAssessmentFormatRequestPayload
        );
      } else {
        const requestPayload = {
          ...payload,
          isActive: Boolean(payload.isActive),
        };
        await mutateCreateAssessmentFormatAsync(requestPayload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      removeParams(['isAssessmentFormatFlyoutOpen', 'assessmentFormatId']);

      setValue('isActive', false);
      setValue('hasMarkEntry', false);

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
          onCloseClick={() => {
            removeParams([
              'assessmentFormatId',
              'isAssessmentFormatFlyoutOpen',
            ]);
          }}
        >
          {isAssessmentFormatListLoading ? (
            <section className="flex h-96 w-full flex-col items-center justify-center gap-4">
              <Spinner />
              <p>Fetching Data</p>
            </section>
          ) : (
            <form onSubmit={handleSubmit(saveAssessmentFormat)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        {assessmentFormatId
                          ? 'Update Assessment Format'
                          : 'Add Assessment Format'}
                      </Text>
                    </div>
                    <div className="flex items-center">
                      <Switch
                        id="isActive"
                        checked={watch('isActive')}
                        {...register('isActive')}
                        onCheckedChange={(value) => setValue('isActive', value)}
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
                {assessmentFormatListResponse.data.length ? (
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Parent Name
                    </label>
                    <Select
                      autoComplete="off"
                      value={watch('parentId')}
                      {...register('parentId')}
                      onValueChange={(value) => {
                        if (value) {
                          setValue('parentId', value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {assessmentFormatListResponse.data.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Assessment Format Name
                  </label>
                  <Input
                    {...register('name', {
                      required: 'Name is Required',
                    })}
                    id="name"
                    autoFocus
                    type="text"
                    className="mt-2"
                    placeholder="Enter Subject Format Name"
                    errorMessage={fieldErrors?.name?.message.toString()}
                  />
                </div>
                <div className="mt-3">
                  <Checkbox
                    {...register('hasMarkEntry')}
                    checked={watch('hasMarkEntry')}
                    onCheckedChange={(isChecked) =>
                      setValue('hasMarkEntry', isChecked === true)
                    }
                  />
                  <label className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Has Mark Entry
                  </label>
                </div>
                <div className="mt-10">
                  <Button
                    size="lg"
                    variant="default"
                    disabled={
                      isPendingCreateAssessmentFormat ||
                      isPendingUpdateAssessmentFormat
                    }
                    aria-disabled={
                      isPendingCreateAssessmentFormat ||
                      isPendingUpdateAssessmentFormat
                    }
                    className="mx-auto flex justify-center px-12 py-4"
                  >
                    {isPendingCreateAssessmentFormat ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                        Saving
                      </div>
                    ) : (
                      `${assessmentFormatId ? 'Update' : 'Save'}`
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
