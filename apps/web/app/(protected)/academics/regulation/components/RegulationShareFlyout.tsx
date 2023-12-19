'use client';

import format from 'date-fns/format';
import { CalendarIcon, Loader2, PlusCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
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
  SheetTrigger,
  Switch,
  Text,
} from 'ui';
import { cn } from 'utils';

import { CreateRegulationModel } from '../../../../../lib/domain/regulation';
import { useCreateRegulationsMutationQuery } from '../../../../../lib/queries/regulations/useCreateRegulationsMutationQuery';

type regulationFlyoutProps = {
  open: boolean;
};
function RegulationShareFlyout({ open }: regulationFlyoutProps) {
  const [isOpen, setIsOpen] = useState(open);

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

  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const {
    isPending: isPendingCreateRegulations,
    mutateAsync: mutateCreateRegulationsAsync,
  } = useCreateRegulationsMutationQuery(
    page ? parseInt(page) : 1,
    limit ? parseInt(limit) : 10
  );

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  async function addRegulation(payload: CreateRegulationModel) {
    try {
      const requestPayload = {
        ...payload,
      };
      mutateCreateRegulationsAsync(requestPayload);
    } catch (error) {
      console.error(error);
    } finally {
      setValue('isActive', false);
      setValue('announcedYear', new Date());
      reset();
      setIsOpen(false);
    }
  }

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetTrigger asChild>
          {/* <Button
            variant="default"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Add Regulation
          </Button> */}
        </SheetTrigger>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => setIsOpen(false)}
        >
          <form onSubmit={handleSubmit(addRegulation)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Add Regulation
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      id="isActive"
                      {...register('isActive')}
                      onCheckedChange={(value) => {
                        setValue('isActive', value);
                      }}
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
                        required: 'announcedYear is Required',
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
                  disabled={isPendingCreateRegulations}
                  aria-disabled={isPendingCreateRegulations}
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingCreateRegulations ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Saving
                    </div>
                  ) : (
                    `Save`
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

export { RegulationShareFlyout };
