'use client';

import { RangeType } from '@prisma/client';
import { useAddRangeScaleMutationQuery } from 'lib/queries/analytics/rangeScales/useAddRangeScaleMutationQuery';
import { useGetClassLevelListQuery } from 'lib/queries/classLevel/useGetClassLevelsListQuery';
import { Loader2, Plus, PlusCircle, Trash } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
  Slider,
  Switch,
  Text,
  useToast,
} from 'ui';

export function AddRangeScaleFlyout() {
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isRangeScaleFlyoutOpen') === 'true';
  const [sliderValues, setSliderValues] = useState([[0, 600]]);
  const [errorMessages, setErrorMessages] = useState([false]);
  const [rangeType, setRangeType] = useState('SubjectMarks');
  const [classLevels, setClassLevels] = useState([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    register,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      rangeOf: 'SubjectMarks',
      classLevelId: 'all',
      scale: [
        {
          startValue: 0,
          endValue: 600,
          order: 1,
        },
      ],
    },
  });

  const { data: ClassLevelListResponse, isLoading: isClassLevelListLoading } =
    useGetClassLevelListQuery({
      page: 1,
      limit: 999,
    });
  const handleValueChange = (index, newValue) => {
    const isOverlapping = sliderValues.some((existingRange, existingIndex) => {
      if (existingIndex === index) return false;
      return (
        (newValue[0] >= existingRange[0] && newValue[0] <= existingRange[1]) ||
        (newValue[1] >= existingRange[0] && newValue[1] <= existingRange[1])
      );
    });

    setErrorMessages((prevErrorMessages) => {
      const newErrorMessages = [...prevErrorMessages];
      newErrorMessages[index] = isOverlapping;
      return newErrorMessages;
    });

    setSliderValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = newValue;
      return newValues;
    });
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'scale' as never,
  });

  const {
    isPending: isPendingCreateGrade,
    mutateAsync: mutateAddRangeScaleAsync,
  } = useAddRangeScaleMutationQuery();

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.delete('isRangeScaleFlyoutOpen');
    router.replace(pathname + '?' + params.toString());
    setSliderValues([[0, 600]]);
    setErrorMessages([false]);
    setRangeType('SubjectMarks');
    reset({
      rangeOf: 'SubjectMarks',
      classLevelId: 'all',
      scale: [
        {
          startValue: 0,
          endValue: 600,
          order: 1,
        },
      ],
    });
  };

  const SaveGrade = async () => {
    const hasDefaultValues = sliderValues.some(
      (value) => value[0] === 0 && value[1] === 600
    );
    if (hasDefaultValues) {
      toast({
        title: 'Adjust Range Scales',
        description: 'Please adjust the scale range values before saving.',
        variant: 'destructive',
      });
      return;
    }
    if (errorMessages.some(Boolean)) {
      toast({
        title: 'Overlapping Scales',
        description: 'Please resolve overlapping ranges before saving.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const selectedClassLevel = watch('classLevelId');
      const classLevelId =
        !selectedClassLevel ||
        selectedClassLevel === 'all' ||
        selectedClassLevel === 'common'
          ? null
          : selectedClassLevel;

      const requestPayload = fields.map((field, index) => ({
        startValue: sliderValues[index][0].toString(),
        endValue: sliderValues[index][1].toString(),
        order: Number(watch(`scale.${index}.order`)) as number,
        rangeOf: watch('rangeOf') as RangeType,
        classLevelId: classLevelId as string | null,
      }));
      await mutateAddRangeScaleAsync(requestPayload);
      toast({
        title: 'Success',
        description: 'Range scale added successfully',
        variant: 'default',
      });
      await closeFlyout();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to save range scale',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (!ClassLevelListResponse) return;
    setClassLevels(ClassLevelListResponse);
  }, [ClassLevelListResponse]);
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
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid lg:grid-cols-[1fr_100px]">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        New Range Scale
                      </Text>
                    </div>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300"></hr>
              </SheetHeader>
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="rangeTypeSwitch"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Range Scale Type
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <Switch
                        id="rangeTypeSwitch"
                        checked={rangeType === 'SubjectMarks'}
                        onCheckedChange={(value) => {
                          const typeValue = value
                            ? 'SubjectMarks'
                            : 'TotalMarks';
                          setRangeType(typeValue);
                          setValue('rangeOf', typeValue);
                        }}
                      />
                      <label
                        htmlFor="rangeTypeSwitch"
                        className="text-sm font-semibold text-gray-900"
                      >
                        {rangeType}
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="classLevelIdSelect"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Class Level
                    </label>
                    <Controller
                      control={control}
                      name="classLevelId"
                      render={({ field }) => {
                        return (
                          <Select
                            value={field.value ?? 'all'}
                            onValueChange={field.onChange}
                            disabled={isClassLevelListLoading}
                          >
                            <SelectTrigger
                              id="classLevelIdSelect"
                              className="mt-1 w-full"
                            >
                              <SelectValue placeholder="Select Class Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="all">
                                  All / Common for all Class Levels
                                </SelectItem>
                                {classLevels.map((classLevel) => (
                                  <SelectItem
                                    key={classLevel.id}
                                    value={classLevel.id}
                                  >
                                    {classLevel.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        );
                      }}
                    />
                    <span className="text-xs text-gray-500">
                      Choose &quot;All / Common&quot; for all classes or select
                      a specific class level.
                    </span>
                  </div>
                </div>
                <div className="flex justify-end">
                  {fields.length === 0 && (
                    <Button
                      className="border-transparent px-2"
                      variant="default"
                      size="sm"
                      onClick={() => {
                        append({ grade: 'grade' });
                        setSliderValues([...sliderValues, [0, 600]]);
                        setErrorMessages([...errorMessages, false]);
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
                          Scale Levels(
                          {sliderValues[index]?.[0]} to{' '}
                          {sliderValues[index]?.[1]})
                        </label>
                        {sliderValues[index] && (
                          <>
                            <Slider
                              sliderValues={
                                sliderValues[index] || watch['scale'].slider
                              }
                              onValueChange={(value) =>
                                handleValueChange(index, value)
                              }
                              defaultValue={[0, 600]}
                              max={600}
                              step={1}
                              className="mt-4"
                            />
                            {errorMessages[index] && (
                              <span className="text-red-500">
                                The scale is already exists
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="w-3/12">
                        <label
                          htmlFor="name"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Order
                        </label>
                        <Input
                          {...register(`scale.${index}.order`, {
                            required: 'Order is Required',
                          })}
                          autoFocus
                          type="number"
                          className="mt-2"
                          id="order"
                          errorMessage={
                            fieldErrors?.scale?.[index]?.order?.message
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
                              setErrorMessages(
                                errorMessages.filter((_, i) => i !== index)
                              );
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
                            setSliderValues([...sliderValues, [0, 600]]);
                            setErrorMessages([...errorMessages, false]);
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
                  disabled={isPendingCreateGrade || errorMessages.some(Boolean)}
                >
                  {isPendingCreateGrade && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
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
