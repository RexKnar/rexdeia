'use client';
import { Plus, PlusCircle, Trash } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Slider,
  Text,
} from 'ui';

import { useCreateGradeMutationQuery } from '../../../../../../lib/queries/grade/useCreateGradeMutationQuery';

export function GradeFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isGradeFlyoutOpen') === 'true';
  const [sliderValues, setSliderValues] = useState([[0, 100]]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    register,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: '',
      grade: [{ name: '', slider: [] }],
    },
  });

  const handleValueChange = (index, newValue) => {
    setSliderValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = newValue;
      return newValues;
    });
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'grade' as never,
  });

  const {
    isPending: isPendingCreateGrade,
    mutateAsync: mutateCreateGradeAsync,
  } = useCreateGradeMutationQuery();

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isGradeFlyoutOpen', 'false');
    router.replace(pathname + '?' + params.toString());
    reset();
    setSliderValues([[0, 100]]);
  };

  const SaveGrade = async () => {
    try {
      const requestPayload = {
        name: watch('name'),
        isActive: true,
        gradeScales: fields.map((field, index) => ({
          startValue: sliderValues[index][0].toString(),
          endValue: sliderValues[index][1].toString(),
          gradeName: watch(`grade.${index}.name`),
          remark: 'testing',
        })),
      };
      await mutateCreateGradeAsync(requestPayload);
    } catch (error) {
      console.error(error);
    } finally {
      await closeFlyout();
      reset();
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
          <div className="max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit(SaveGrade)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        New Grade System
                      </Text>
                    </div>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300"></hr>
              </SheetHeader>
              <div className="mt-5 flex gap-2">
                <div className="w-full">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Grade System Name
                  </label>
                  <Input
                    {...register('name', {
                      required: 'Grade Name is Required',
                    })}
                    autoFocus
                    className="mt-2"
                    id="name"
                    errorMessage={fieldErrors?.name?.message.toString()}
                  />
                </div>
                <div className="mt-8">
                  {fields.length === 0 && (
                    <Button
                      className="border-transparent px-2"
                      variant="default"
                      size="sm"
                      onClick={() => {
                        append({ grade: 'grade' });
                        setSliderValues([...sliderValues, [0, 100]]);
                      }}
                    >
                      <Plus size={20} className="text-center text-white" />
                    </Button>
                  )}
                </div>
              </div>
              {fields.map((row, index) => (
                <section key={row.id}>
                  <div className="ml-9 mt-5">
                    <div className="mt-4 flex gap-2 ">
                      <div className="w-full">
                        <label
                          htmlFor="name"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Grade Levels(
                          {sliderValues[index]?.[0]} to{' '}
                          {sliderValues[index]?.[1]})
                        </label>
                        {sliderValues[index] && (
                          <Slider
                            sliderValues={
                              sliderValues[index] || watch['grade'].slider
                            }
                            onValueChange={(value) =>
                              handleValueChange(index, value)
                            }
                            defaultValue={[0, 100]}
                            max={100}
                            step={1}
                            className="mt-4"
                          />
                        )}
                      </div>
                      <div className="w-3/12">
                        <label
                          htmlFor="name"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Grade
                        </label>
                        <Input
                          {...register(`grade.${index}.name`, {
                            required: 'Name is Required',
                          })}
                          autoFocus
                          className="mt-2"
                          id="name"
                          errorMessage={
                            fieldErrors?.grade?.[index]?.name?.message
                          }
                        />
                      </div>
                      <div className="mt-8">
                        {fields.length > 0 && (
                          <Button
                            className="border-transparent bg-red-600 px-2"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <Trash
                              size={20}
                              className="text-center text-white"
                            />
                          </Button>
                        )}
                      </div>
                      <div className="mt-8">
                        <Button
                          className={`border-transparent px-2 ${
                            index === fields.length - 1 ? '' : 'invisible'
                          }`}
                          variant="default"
                          size="sm"
                          onClick={() => {
                            append({ grade: 'grade' });
                            setSliderValues([...sliderValues, [0, 100]]);
                          }}
                        >
                          <Plus size={20} className="text-center text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              ))}
              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  className="mx-auto flex justify-center px-12 py-4"
                  disabled={isPendingCreateGrade}
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
