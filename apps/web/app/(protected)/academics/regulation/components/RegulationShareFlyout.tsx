'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
  Text,
} from 'ui';

import { CreateRegulationModel } from '../../../../../lib/domain/regulation';
import { useCreateRegulationsForFormMutationQuery } from '../../../../../lib/queries/useCreateRegulationsForFormMutationQuery';

function RegulationShareFlyout() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors: fieldErrors },
  } = useForm();

  const isLinkActive = useWatch({ name: 'isActive', control });

  const {
    isPending: isPendingCreateRegulations,
    mutateAsync: mutateCreateRegulationsAsync,
  } = useCreateRegulationsForFormMutationQuery();

  async function addRegulation(payload: CreateRegulationModel) {
    try {
      const requestPayload = {
        ...payload,
        isActive: isLinkActive === 'true',
      };
      await mutateCreateRegulationsAsync(requestPayload);
    } catch (error) {
      console.error(error);
    } finally {
      reset();
      setIsOpen(false);
    }
  }

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Add Regulation
          </Button>
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
                      {...register('isActive', {
                        required: 'Active Status is Required',
                      })}
                      id="isActive"
                      value={isLinkActive ? 'true' : 'false'}
                      onCheckedChange={() => {
                        setValue('isActive', !isLinkActive);
                      }}
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 text-sm font-semibold"
                    >
                      {isLinkActive ? 'Active' : 'Inactive'}
                    </label>
                    <p
                      className={`h-2 p-1 text-sm text-red-600 ${
                        fieldErrors.isActive
                          ? 'opacity-100 transition-opacity duration-300'
                          : 'opacity-0 transition-opacity duration-300'
                      }`}
                    >
                      {fieldErrors.isActive?.message as string}
                    </p>
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
                  className="border-primary-200 p-1"
                  id="regulationName"
                />
                <p
                  className={`h-2 p-1 text-center text-sm text-red-600 ${
                    fieldErrors.regulationName
                      ? 'opacity-100 transition-opacity duration-300'
                      : 'opacity-0 transition-opacity duration-300'
                  }`}
                >
                  {fieldErrors.regulationName?.message as string}
                </p>
              </div>
              <div>
                <label
                  htmlFor="announcedYear"
                  className="text-sm font-semibold text-gray-700"
                >
                  Start Year
                </label>
                <Input
                  type="date"
                  {...register('announcedYear', {
                    required: 'announcedYear is Required',
                  })}
                  className="border-primary-200 p-1"
                  id="announcedYear"
                />
                <p
                  className={`h-2 p-1 text-center text-sm text-red-600 ${
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
