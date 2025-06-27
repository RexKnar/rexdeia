'use client';

import { useGetClassLevelListQuery } from 'lib/queries/classLevel/useGetClassLevelsListQuery';
import { useGetDaysListQuery } from 'lib/queries/days/useGetDaysListQuery';
import { useCreatePeriodMasterMutationQuery } from 'lib/queries/periodMaster/useCreatePeriodMasterMutationQuery';
import { PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
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

export function AddPeriodMasterFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // const mediumId = searchParams.get('mediumId');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const isOpen = searchParams.get('isPeriodMasterFlyoutOpen') === 'true';
  // const page = parseInt(getParam('page')) || 1;
  // const limit = parseInt(getParam('limit')) || 10;
  const {
    register,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: null,
      isActive: false,
      order: null,
      classLevelId: null,
      periodId: null,
      daysId: null,
    },
  });

  const { data: classLevelListResponse } = useGetClassLevelListQuery({
    page,
    limit,
  });
  useGetDaysListQuery({
    page,
    limit,
  });
  const { mutate: createPeriodMasterMutation } =
    useCreatePeriodMasterMutationQuery(page, limit);

  const closePeriodMasterFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isPeriodMasterFlyoutOpen', 'false');
    router.replace(pathname + '?' + params.toString());
    reset();
  };

  async function savePeriodMaster(payload) {
    try {
      const requestPayload = {
        ...payload,
      };
      await createPeriodMasterMutation(requestPayload);
    } catch (error) {
      console.error(error);
    } finally {
      closePeriodMasterFlyout();
      setValue('isActive', false);
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
          onCloseClick={() => closePeriodMasterFlyout()}
        >
          <form onSubmit={handleSubmit(savePeriodMaster)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Add Period Master
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
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Period Master Name
                </label>
                <Input
                  {...register('name', {
                    required: ' Name is required',
                  })}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  className="mt-1"
                  autoComplete="off"
                  autoFocus
                  name="name"
                />
                {errors['name'] && (
                  <p className="mb-2 h-2 p-1 text-sm text-red-600">
                    {errors['name'].message as string}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="order"
                  className="text-sm font-semibold text-gray-700"
                >
                  Order
                </label>
                <Input
                  {...register('order', {
                    required: 'order is Required',
                  })}
                  autoFocus
                  className="mt-2"
                  id="name"
                  type="number"
                />
                {errors['order'] && (
                  <p className="mb-2 h-2 p-1 text-sm text-red-600">
                    {errors['order'].message as string}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Class Level
                </label>
                <Select
                  autoComplete="off"
                  value={watch('classLevelId')}
                  {...register('classLevelId', {
                    required: 'Class Level is required',
                  })}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('classLevelId', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {classLevelListResponse &&
                        classLevelListResponse?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors['classLevelId'] && (
                  <p className="mb-2 h-2 p-1 text-sm text-red-600">
                    {errors['classLevelId'].message as string}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">Day</label>
                <Select
                  autoComplete="off"
                  value={watch('daysId')}
                  {...register('daysId', {
                    required: 'Select a day',
                  })}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('daysId', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup></SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  save
                </Button>
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
