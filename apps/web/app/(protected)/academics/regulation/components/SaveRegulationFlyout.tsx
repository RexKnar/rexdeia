'use client';

import format from 'date-fns/format';
import { CalendarIcon, Loader2, PlusCircle } from 'lucide-react';
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
  Calendar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Switch,
  Text,
} from 'ui';
import { cn } from 'utils';

import { CreateRegulationModel } from '../../../../../lib/domain/regulation';
import { useCreateRegulationsMutationQuery } from '../../../../../lib/queries/regulations/useCreateRegulationsMutationQuery';
import { useGetRegulationByIdQuery } from '../../../../../lib/queries/regulations/useGetRegulationByIdQuery';
import { useUpdateRegulationMutationQuery } from '../../../../../lib/queries/regulations/useUpdateRegulationMutationQuery';

export function SaveRegulationFlyout() {
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

  const [isOpen, setIsOpen] = useQueryState(
    'isFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );
  const [regulationId, setRegulationId] = useQueryState(
    'regulationId',
    parseAsString
  );

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit] = useQueryState('limit', parseAsInteger.withDefault(10));

  const {
    isPending: isPendingCreateRegulations,
    mutateAsync: mutateCreateRegulationsAsync,
  } = useCreateRegulationsMutationQuery(page, limit);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeToggleFlag, setActiveToggleFlag] = useState(false);

  const closeFlyout = async () => {
    await setIsOpen(false);
    await setRegulationId(null);
  };

  const { data: getRegulationByIdResponse } =
    useGetRegulationByIdQuery(regulationId);

  useEffect(() => {
    if (getRegulationByIdResponse) {
      const { regulationName, isActive, announcedYear } =
        getRegulationByIdResponse;

      setValue('regulationName', regulationName);
      setValue('isActive', isActive);
      setValue('announcedYear', new Date(announcedYear));
      setActiveToggleFlag(isActive);
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
          <form onSubmit={handleSubmit(saveRegulation)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
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
                  Regulation Name
                </label>
                <Input
                  {...register('regulationName', {
                    required: 'Regulation Name is Required',
                  })}
                  className="mt-2"
                  id="regulationName"
                />
                <p
                  className={`h-2 p-1 text-sm text-red-600 ${
                    fieldErrors.regulationName
                      ? 'opacity-100 transition-opacity duration-300'
                      : 'opacity-0 transition-opacity duration-300'
                  }`}
                >
                  {fieldErrors.regulationName?.message as string}
                </p>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="announcedYear"
                  className="text-sm font-semibold text-gray-700"
                >
                  Start Year
                </label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger
                    asChild
                    className="rounded-md border border-primary-200 p-3"
                  >
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start justify-between text-left font-normal',
                        !watch('announcedYear') && 'text-muted-foreground flex'
                      )}
                    >
                      <span>
                        {watch('announcedYear') ? (
                          format(watch('announcedYear'), 'PPP')
                        ) : (
                          <>Pick a date</>
                        )}
                      </span>
                      <label className="flex justify-end text-sm font-normal text-gray-700">
                        <CalendarIcon className="mr-2 flex h-4 w-4 justify-end text-primary-500" />
                      </label>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-index-99 w-auto bg-white p-0">
                    <Calendar
                      {...register('announcedYear', {
                        required: 'Start Year is Required',
                      })}
                      mode="single"
                      selected={watch('announcedYear')}
                      onSelect={(selectedDate) => {
                        setValue('announcedYear', selectedDate);
                        setIsCalendarOpen(false);
                      }}
                      id="announcedYear"
                    />
                  </PopoverContent>
                </Popover>
                <p
                  className={`h-2 p-1 text-sm text-red-600 ${
                    fieldErrors.announcedYear
                      ? 'opacity-100 transition-opacity duration-300'
                      : 'opacity-0 transition-opacity duration-300'
                  }`}
                >
                  {fieldErrors.announcedYear?.message as string}
                </p>
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
        </SheetContent>
      </Sheet>
    </section>
  );
}
