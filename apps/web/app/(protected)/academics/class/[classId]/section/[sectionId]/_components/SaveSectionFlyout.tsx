'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
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
      isActive: false,
    },
  });

  useEffect(() => {
    setValue('mediumId', 'Tamil');
  }, [setValue]);

  const [medium, setMedium] = useState('Tamil');
  useEffect(() => {
    setValue('mediumId', 'Tamil');
  }, [setValue]);

  const params = useParams<{ sectionId: string }>();
  const isOpen = searchParams.get('isSectionFlyoutOpen') === 'true';
  const classId = searchParams.get('classId');

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isSectionFlyoutOpen', 'false');
    params.delete('sectionId');

    router.replace(pathname + '?' + params.toString());
  };

  const { data: getSectionResponse } = useGetSectionByIdQuery(
    params.sectionId,
    {
      enabled: !!params.sectionId,
    }
  );

  useEffect(() => {
    if (getSectionResponse) {
      const { name, isActive, medium } = getSectionResponse;

      setValue('name', name);
      setValue('isActive', isActive);
      setValue('mediumId', medium.name);
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
    });
  const {
    isPending: isPendingUpdateSection,
    mutateAsync: mutateUpdateSectionAsync,
  } = useUpdateSectionMutationQuery(params.sectionId);

  const saveSection = async (payload: SectionModel) => {
    try {
      if (classId) {
        const addSectionPayload = {
          ...payload,
          classId,
        };
        mutateCreateSectionAsync(addSectionPayload);
      } else {
        const updateSectionPayload = {
          ...payload,
        };
        mutateUpdateSectionAsync(updateSectionPayload);
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
          <form onSubmit={handleSubmit(saveSection)}>
            <SheetHeader>
              <SheetTitle>
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      {classId ? 'New Section' : 'Update Section'}
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
                    value={medium}
                    onValueChange={(value) => {
                      setMedium(value);
                      setValue('mediumId', value);
                    }}
                  >
                    <SelectTrigger className="w-full" defaultValue={'Tamil'}>
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
                      `${classId ? 'Updating' : 'Saving'}`
                    </div>
                  ) : (
                    `${classId ? 'Update' : 'Save'}`
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
