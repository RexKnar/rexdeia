'use client';

import { useGetClassLevelListQuery } from 'lib/queries/classLevel/useGetClassLevelsListQuery';
import { useGetGroupListQuery } from 'lib/queries/group/useGetGroupListQuery';
import { Loader2, Plus, Trash } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
  Switch,
  Text,
} from 'ui';

import { useCreateClassMutationQuery } from '../../../../../../lib/queries/class/useCreateClassMutationQuery';
import { useGetMediumListQuery } from '../../../../../../lib/queries/medium/useGetMediumListQuery';

export default function AddClass() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const filter = { isActive: true };

  const {
    control,
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'section',
  });

  const [activeToggleFlag, setActiveToggleFlag] = useState(false);

  const { data: groupListResponse } = useGetGroupListQuery({
    page: 1,
    limit: 999,
    filter,
  });

  const {
    mutateAsync: mutateCreateClassAsync,
    isPending: isPendingCreateClass,
  } = useCreateClassMutationQuery(page, limit);

  const { data: mediumListResponse, isLoading: isMediumListLoading } =
    useGetMediumListQuery({
      page: 1,
      limit: 999,
      filter,
    });
  const { data: ClassLevelListResponse, isLoading: isClassLevelListLoading } =
    useGetClassLevelListQuery({
      page,
      limit,
    });

  useEffect(() => {
    setValue('isActive', false);
  }, [setValue]);

  async function addClass(payload) {
    try {
      const response = await mutateCreateClassAsync(payload);

      if (response) {
        router.push(`/academics/class/`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="relative mt-[20px] w-full">
      <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
        <div className="flex items-center">
          <Text variant="lg-semibold" className="ml-2 text-2xl">
            New Class
          </Text>
        </div>
        <div className="items-center">
          <Switch
            id="isActive"
            {...register('isActive')}
            onCheckedChange={(value) => {
              setValue('isActive', value);
              setActiveToggleFlag(value);
            }}
            checked={activeToggleFlag}
          />
          <label htmlFor="isActive" className="ml-2 text-sm font-semibold">
            {activeToggleFlag ? 'Active' : 'Inactive'}
          </label>
        </div>
      </div>

      <div>
        <form onSubmit={handleSubmit(addClass)}>
          <div className="mt-4 grid grid-cols-1 flex-wrap justify-between gap-5 md:grid md:grid-cols-1 lg:grid lg:grid-cols-2">
            <div className="col-6">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Class Name
              </label>
              <Input
                {...register('name', {
                  required: 'Class Name is Required',
                })}
                className="border-primary-200 p-1"
                id="name"
                errorMessage={fieldErrors?.name?.message.toString()}
              />
            </div>
            <div>
              <label
                htmlFor="medium"
                className="text-sm font-semibold text-gray-700"
              >
                Class Level
              </label>
              <Controller
                control={control}
                name={`classLevelId`}
                render={({ field }) => {
                  return (
                    <Select
                      onValueChange={field.onChange}
                      {...field}
                      disabled={isClassLevelListLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {ClassLevelListResponse?.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  );
                }}
              ></Controller>
            </div>
          </div>
          <div>
            <div className="mt-8">
              {fields.map((row, index) => (
                <div
                  key={row.id}
                  className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-4"
                >
                  <div className="">
                    <label
                      htmlFor="sectionName"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Section Name
                    </label>
                    <Input
                      {...register(`section.${index}.name`, {
                        required: 'Section Name is Required',
                      })}
                      key={index}
                      className="border-primary-200 p-1"
                      id="sectionName"
                      errorMessage={fieldErrors?.section?.message.toString()}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="medium"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Medium
                    </label>
                    <Controller
                      control={control}
                      name={`section.${index}.mediumId`}
                      render={({ field }) => {
                        return (
                          <Select
                            onValueChange={field.onChange}
                            {...field}
                            disabled={isMediumListLoading}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
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
                        );
                      }}
                    ></Controller>
                  </div>
                  <div>
                    <label
                      htmlFor={`group-${index}`}
                      className="text-sm font-semibold text-gray-700"
                    >
                      Group
                    </label>
                    <div className="flex flex-wrap">
                      {groupListResponse?.data?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`group-${index}`}
                            className="ml-2 items-center space-x-2 rounded border border-primary-500"
                            checked={watch(
                              `section.${index}.groupIds`
                            )?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              const currentGroupIds =
                                watch(`section.${index}.groupIds`) || [];
                              if (checked) {
                                setValue(`section.${index}.groupIds`, [
                                  ...currentGroupIds,
                                  item.id,
                                ]);
                              } else {
                                setValue(
                                  `section.${index}.groupIds`,
                                  currentGroupIds.filter(
                                    (value) => value !== item.id
                                  )
                                );
                              }
                            }}
                          />
                          <span className="mr-2">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Button
                      className="mt-5 h-9 w-9 border-transparent bg-red-600 p-2 "
                      variant="outline"
                      type="button"
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <Trash size={32} className="text-center text-white" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                className=" ml-4 mt-[1.5rem]  w-full border-dotted  p-2 text-primary "
                variant="outline"
                onClick={() => {
                  append({ section: 'section' });
                }}
              >
                <Plus size={32} className="text-center text-primary" />
              </Button>
            </div>
          </div>
          <div className="mt-10">
            <Button
              size="lg"
              variant="default"
              disabled={isPendingCreateClass}
              aria-disabled={isPendingCreateClass}
              className="mx-auto flex justify-center px-12 py-4"
            >
              {isPendingCreateClass ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                  Saving
                </div>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
