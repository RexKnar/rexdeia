'use client';

import { useGetClassLevelListQuery } from 'lib/queries/classLevel/useGetClassLevelsListQuery';
import { useGetGradeList } from 'lib/queries/grade/useGetGradeListMutationQuery';
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

import { SearchableSelect } from '@/components/SearchableSelect';

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
  const { data: gradeListResponse, isLoading: isGradeListLoading } =
    useGetGradeList({
      page: 1,
      limit: 999,
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
    <section className="relative w-full px-4 mt-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Text variant="lg-semibold" className="text-2xl">
          New Class
        </Text>
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
          <label htmlFor="isActive" className="ml-2 text-sm font-semibold">
            {activeToggleFlag ? 'Active' : 'Inactive'}
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit(addClass)}>
        <div className="grid grid-cols-1 gap-5 mt-6 lg:grid-cols-2">
          <div>
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
              className="p-1 border-primary-200"
              id="name"
              errorMessage={fieldErrors?.name?.message?.toString()}
            />
          </div>
          <div>
            <label
              htmlFor="classLevel"
              className="text-sm font-semibold text-gray-700"
            >
              Class Level
            </label>
            <Controller
              control={control}
              name="classLevelId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isClassLevelListLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Class Level" />
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
              )}
            />
          </div>
        </div>

        <div className="mt-10">
          {fields.map((row, index) => (
            <div
              key={row.id}
              className="grid grid-cols-1 gap-5 mb-6 md:grid-cols-2 xl:grid-cols-5"
            >
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Section Name
                </label>
                <Input
                  {...register(`section.${index}.name`, {
                    required: 'Section Name is Required',
                  })}
                  className="p-1 border-primary-200"
                  errorMessage={fieldErrors?.section?.message?.toString()}
                />
              </div>
              <Controller
                control={control}
                name={`section.${index}.mediumId`}
                render={({ field }) => (
                  <SearchableSelect
                    label="Medium"
                    value={field.value}
                    onChange={field.onChange}
                    options={mediumListResponse?.data || []}
                    placeholder="Select Medium"
                    disabled={isMediumListLoading}
                  />
                )}
              />
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Group
                </label>
                <div className="flex flex-wrap gap-2">
                  {groupListResponse?.data?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`group-${index}-${item.id}`}
                        checked={watch(`section.${index}.groupIds`)?.includes(
                          item.id
                        )}
                        onCheckedChange={(checked) => {
                          const currentGroupIds =
                            watch(`section.${index}.groupIds`) || [];
                          setValue(
                            `section.${index}.groupIds`,
                            checked
                              ? [...currentGroupIds, item.id]
                              : currentGroupIds.filter((id) => id !== item.id)
                          );
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Grade System (for marks)
                </label>
                <Controller
                  control={control}
                  name={`gradeId`}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isGradeListLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Grade System" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {gradeListResponse?.data?.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex items-center lg:justify-center">
                <Button
                  className="mt-5 text-white bg-red-600 hover:bg-red-700"
                  variant="outline"
                  type="button"
                  onClick={() => remove(index)}
                >
                  <Trash size={20} />
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            onClick={() => append({})}
            variant="outline"
            className="w-full mt-6 border-dotted text-primary"
          >
            <Plus size={20} className="mr-2" />
            Add Section
          </Button>
        </div>

        <div className="flex justify-center mt-10">
          <Button
            size="lg"
            variant="default"
            disabled={isPendingCreateClass}
            aria-disabled={isPendingCreateClass}
            className="px-12 py-4"
          >
            {isPendingCreateClass ? (
              <div className="flex items-center">
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Saving
              </div>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
