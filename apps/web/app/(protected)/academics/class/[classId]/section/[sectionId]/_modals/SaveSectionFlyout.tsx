'use client';

import { useGetGroupListQuery } from 'lib/queries/group/useGetGroupListQuery';
import { Loader2, PlusCircle } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
  Switch,
  Text,
} from 'ui';

import { SectionModel } from '../../../../../../../../lib/domain/section';
import { useGetMediumListQuery } from '../../../../../../../../lib/queries/medium/useGetMediumListQuery';
import { useCreateSectionMutationQuery } from '../../../../../../../../lib/queries/section/useCreateSectionMutationQuery';
import { useGetSectionByIdQuery } from '../../../../../../../../lib/queries/section/useGetSectionByIdQuery';
import { useUpdateSectionMutationQuery } from '../../../../../../../../lib/queries/section/useUpdateSectionMutationQuery';

export function SaveSectionFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    control,
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
      mediumId: null,
      groupIds: null,
      isActive: false,
    },
  });

  const params = useParams<{ sectionId: string }>();
  const classIdFromQueryParams = useParams<{ classId: string }>();
  const isOpen = searchParams.get('isSectionFlyoutOpen') === 'true';
  const classIdFromSearchParams = searchParams.get('classId');
  const classId = classIdFromSearchParams
    ? classIdFromSearchParams
    : classIdFromQueryParams?.classId;
  const filter = {};

  const closeFlyout = async () => {
    setMediumId('');
    const params = new URLSearchParams(searchParams);
    params.set('isSectionFlyoutOpen', 'false');
    params.delete('sectionId');
    router.push(pathname + '?' + params.toString());
  };

  const { data: getSectionResponse } = useGetSectionByIdQuery(
    params.sectionId,
    {
      enabled: !!params.sectionId,
    }
  );

  const { data: groupListResponse } = useGetGroupListQuery({
    page: 1,
    limit: 999,
    filter,
  });

  const [mediumId, setMediumId] = useState('');
  useEffect(() => {
    if (getSectionResponse) {
      const { name, isActive, mediumId } = getSectionResponse;
      setValue('name', name);
      setValue('isActive', isActive);
      setValue('mediumId', mediumId);
      setMediumId(mediumId);
    } else {
      setValue('name', null);
      setValue('isActive', false);
      setValue('mediumId', null);
    }
  }, [getSectionResponse, setValue]);

  const {
    isPending: isPendingCreateSection,
    mutateAsync: mutateCreateSectionAsync,
  } = useCreateSectionMutationQuery();

  const { data: mediumListResponse, isLoading: isMediumListLoading } =
    useGetMediumListQuery({
      page: 1,
      limit: 999,
      filter,
    });

  const {
    isPending: isPendingUpdateSection,
    mutateAsync: mutateUpdateSectionAsync,
  } = useUpdateSectionMutationQuery(params.sectionId);

  const isEditing = !!params.sectionId;

  const saveSection = async (payload: SectionModel) => {
    try {
      if (isEditing) {
        const updateSectionPayload = {
          ...payload,
        };
        await mutateUpdateSectionAsync(updateSectionPayload);
      } else {
        const addSectionPayload = {
          ...payload,
          classId,
        };
        await mutateCreateSectionAsync(addSectionPayload);
      }

      await closeFlyout();
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setMediumId('');
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
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      {params.sectionId ? 'Update Section' : 'New Section'}
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
                  htmlFor="sectionName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Section Name
                </label>
                <Input
                  className="mt-2"
                  autoFocus
                  {...register('name', {
                    required: 'Section Name is Required',
                  })}
                  id="name"
                  errorMessage={fieldErrors?.name?.message.toString()}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="mediumName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Medium
                </label>
                <div className="mt-2 w-full">
                  <Select
                    disabled={isMediumListLoading}
                    value={mediumId}
                    onValueChange={(value) => {
                      setMediumId(value);
                      setValue('mediumId', value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue {...register('mediumId')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {mediumListResponse?.data?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-3">
                <label
                  htmlFor="group"
                  className="text-sm font-semibold text-gray-700"
                >
                  Group
                </label>
                <div className="mt-2 flex flex-wrap">
                  {groupListResponse?.data?.map((item) => (
                    <label className="me-5" key={item.id}>
                      <Controller
                        key={item.id}
                        control={control}
                        name={`groupIds`}
                        render={({ field }) => {
                          return (
                            <label className="me-5">
                              <Checkbox
                                className="me-2 items-center space-x-2 rounded border border-primary-500"
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        item.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                              <span>{item.name}</span>
                            </label>
                          );
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-16">
                <Button
                  size="lg"
                  variant="default"
                  disabled={isPendingCreateSection || isPendingUpdateSection}
                  aria-disabled={
                    isPendingCreateSection || isPendingUpdateSection
                  }
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingCreateSection || isPendingUpdateSection ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      {isEditing ? 'Updating' : 'Saving'}
                    </div>
                  ) : isEditing ? (
                    'Update'
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
