'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  DateSelector,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Spinner,
  Switch,
  Text,
} from 'ui';

import { CreateRegulationModel } from '../../../../../lib/domain/regulation';
import { useCreateRegulationsMutationQuery } from '../../../../../lib/queries/regulations/useCreateRegulationsMutationQuery';
import { useGetRegulationByIdQuery } from '../../../../../lib/queries/regulations/useGetRegulationByIdQuery';
import { useUpdateRegulationMutationQuery } from '../../../../../lib/queries/regulations/useUpdateRegulationMutationQuery';

export function SaveRegulationFlyout() {
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
    defaultValues: {
      isActive: false,
      announcedYear: null,
      regulationName: null,
    },
  });

  const [announcedYear, setAnnouncedYear] = useState(null);

  const isOpen = searchParams.get('isFlyoutOpen') === 'true';
  const regulationId = searchParams.get('regulationId');

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const {
    isPending: isPendingCreateRegulations,
    mutateAsync: mutateCreateRegulationsAsync,
  } = useCreateRegulationsMutationQuery(page, limit);

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isFlyoutOpen', 'false');
    params.delete('regulationId');

    router.replace(pathname + '?' + params.toString());
  };

  const {
    data: getRegulationByIdResponse,
    isLoading: isCurrentRegulationLoading,
    isFetching: isCurrentRegulationFetching,
  } = useGetRegulationByIdQuery(regulationId, {
    enabled: !!regulationId,
    queryKey: [],
  });

  useEffect(() => {
    if (getRegulationByIdResponse) {
      const { regulationName, isActive, announcedYear } =
        getRegulationByIdResponse;

      setValue('regulationName', regulationName);
      setValue('isActive', isActive);
      setValue('announcedYear', new Date(announcedYear));
    } else {
      setValue('regulationName', null);
      setValue('isActive', false);
      setValue('announcedYear', null);
    }
  }, [getRegulationByIdResponse, setValue]);

  const {
    isPending: isPendingUpdateRegulations,
    mutateAsync: mutateUpdateRegulationAsync,
  } = useUpdateRegulationMutationQuery(page, limit);

  async function saveRegulation(payload: CreateRegulationModel) {
    try {
      if (regulationId) {
        const updateBatchRequestPayload = {
          ...payload,
          id: regulationId,
        };
        mutateUpdateRegulationAsync(updateBatchRequestPayload);
      } else {
        const requestPayload = {
          ...payload,
        };
        mutateCreateRegulationsAsync(requestPayload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setValue('isActive', false);
      setValue('announcedYear', new Date());
      reset();
      closeFlyout();
      setAnnouncedYear(null);
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
          {isCurrentRegulationLoading || isCurrentRegulationFetching ? (
            <section className="flex h-96 w-full flex-col items-center justify-center gap-4">
              <Spinner />
              <p>Fetching Data</p>
            </section>
          ) : (
            <form onSubmit={handleSubmit(saveRegulation)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        {regulationId ? 'Update Regulation' : 'Add Regulation'}
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
                    htmlFor="regulationName"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Regulation Name
                  </label>
                  <Input
                    {...register('regulationName', {
                      required: 'Regulation Name is Required',
                    })}
                    autoFocus
                    className="mt-2"
                    placeholder="Regulation Name"
                    id="regulationName"
                    errorMessage={fieldErrors?.regulationName?.message.toString()}
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="announcedYear"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Start Year
                  </label>
                  <DateSelector
                    id="announcedYear"
                    required
                    autoComplete="off"
                    placeholderText="Regulation Year"
                    onChange={(value) => {
                      setValue('announcedYear', value);
                      setAnnouncedYear(value);
                    }}
                    dateFormat="dd/MM/yyyy"
                    selected={announcedYear}
                    isClearable={false}
                  />
                </div>

                <div className="mt-10">
                  <Button
                    size="lg"
                    variant="default"
                    disabled={
                      isPendingCreateRegulations || isPendingUpdateRegulations
                    }
                    aria-disabled={
                      isPendingCreateRegulations || isPendingUpdateRegulations
                    }
                    className="mx-auto flex justify-center px-12 py-4"
                  >
                    {isPendingCreateRegulations ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                        Saving
                      </div>
                    ) : (
                      `${regulationId ? 'Update' : 'Save'}`
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
