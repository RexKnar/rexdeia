'use client';

import { useCreateCourseMutationQuery } from 'lib/queries/institute/course/useCreateCourseMutationQuery';
import { useGetLanguageListQuery } from 'lib/queries/language/useGetLanguageListQurey';
import { Loader2, PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
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
  Text,
  Textarea,
} from 'ui';

export function AddCourseFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isAddCourseFlyoutOpen') === 'true';
  const [languageList, setLanguageList] = useState([]);

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    register,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      courseName: '',
      description: '',
      price: '',
      discountPrice: '',
      languageId: '',
      isActive: false,
    },
  });
  const {
    isPending: isPendingCreateCourse,
    mutateAsync: mutateCreateCourseAsync,
  } = useCreateCourseMutationQuery();

  const { data: getLanguageListResponse } = useGetLanguageListQuery();
  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isAddCourseFlyoutOpen', 'false');
    router.replace(pathname + '?' + params.toString());
  };

  useEffect(() => {
    if (getLanguageListResponse) {
      setLanguageList(getLanguageListResponse as any[]);
    }
  }, [getLanguageListResponse]);

  const SaveCourse = async (payload) => {
    try {
      const requestPayload = payload;
      await mutateCreateCourseAsync(requestPayload);
    } catch (error) {
      console.error(error);
    } finally {
      await closeFlyout();
      reset();
    }
  };

  return (
    <Sheet open={isOpen}>
      <SheetContent
        side="right"
        widthSize="sm"
        className="bg-white p-10"
        onCloseClick={() => closeFlyout()}
      >
        <div className="max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit(SaveCourse)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid lg:grid-cols-[1fr_100px]">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Add New Course
                    </Text>
                  </div>
                </div>
              </SheetTitle>
              <hr className="border-t border-gray-300"></hr>
            </SheetHeader>
            <div className="mt-5">
              <div>
                <label
                  htmlFor="courseName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Course Title
                </label>
                <Input
                  {...register('courseName', {
                    required: 'Title is Required',
                  })}
                  autoFocus
                  className="mt-2"
                  id="courseName"
                  errorMessage={fieldErrors?.courseName?.message.toString()}
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="text-sm font-semibold text-gray-700"
                >
                  Price
                </label>
                <Input
                  {...register('price', {
                    required: 'Price is Required',
                  })}
                  autoFocus
                  className="mt-2"
                  id="price"
                  errorMessage={fieldErrors?.price?.message.toString()}
                />
              </div>

              <div>
                <label
                  htmlFor="discountPrice"
                  className="text-sm font-semibold text-gray-700"
                >
                  Discount Price
                </label>
                <Input
                  {...register('discountPrice', {
                    required: 'Discount Price is Required',
                  })}
                  autoFocus
                  className="mt-2"
                  id="discountPrice"
                  errorMessage={fieldErrors?.discountPrice?.message.toString()}
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="type"
                  className="text-sm font-semibold text-gray-700"
                >
                  Language
                </label>
                <Select
                  autoComplete="off"
                  value={watch('languageId')}
                  {...register('languageId')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('languageId', value);
                    }
                  }}
                >
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {languageList.map((item, index) => (
                        <SelectItem value={item.id} key={index}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldErrors['regulationId'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {fieldErrors['regulationId'].message as string}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-gray-700"
                >
                  Description
                </label>
                <Textarea
                  {...register('description', {
                    required: 'Description is Required',
                  })}
                  autoFocus
                  className="mt-2"
                  id="description"
                  errorMessage={fieldErrors?.description?.message.toString()}
                />
              </div>

              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  disabled={isPendingCreateCourse}
                  aria-disabled={isPendingCreateCourse}
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingCreateCourse ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Saving
                    </div>
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
