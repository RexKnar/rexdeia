'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'next-usequerystate';
import { useState } from 'react';
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
  Switch,
  Text,
} from 'ui';

import { useCreateClassMutationQuery } from '../../../../../../lib/queries/class/useCreateClassMutationQuery';

export default function AddClass() {
  const { control, register, setValue, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'section',
  });

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit] = useQueryState('limit', parseAsInteger.withDefault(10));
  const [activeToggleFlag, setActiveToggleFlag] = useState(false);

  const {
    mutateAsync: mutateCreateClassAsync,
    isPending: isPendingCreateClass,
  } = useCreateClassMutationQuery(page, limit);

  async function addClass(payload) {
    try {
      await mutateCreateClassAsync(payload);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="relative mt-[20px] w-full">
      <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
        <div className="flex items-center">
          <PlusCircle size={20} strokeWidth={1.5} />
          <Text variant="lg-semibold" className="ml-2">
            Add Class
          </Text>
        </div>
        <div className="items-center">
          <Switch
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
          <div className="mt-4 grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-2 ">
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
              />
            </div>
            <div></div>
          </div>
          <div>
            <div className="mt-3 ">
              <h2>Sections</h2>
              {fields.map((row, index) => (
                <div
                  key={row.id}
                  className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-4 "
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
                      key={row.id}
                      className="border-primary-200 p-1"
                      id="sectionName"
                    />
                    <p
                      className={`h-2 p-1 text-center text-sm text-red-600 `}
                    ></p>
                  </div>
                  <div className="">
                    <label
                      htmlFor="medium"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Medium
                    </label>
                    <Controller
                      control={control}
                      name={`section.${index}.medium`}
                      render={({ field }) => {
                        return (
                          <Select onValueChange={field.onChange} {...field}>
                            <SelectTrigger className="w-auto ">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value={'English'}>
                                  English
                                </SelectItem>
                                <SelectItem value={'Tamil'}>Tamil</SelectItem>
                                <SelectItem value={'Malayalam'}>
                                  Malayalam
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        );
                      }}
                    ></Controller>
                  </div>
                  <div className="">
                    <label
                      htmlFor="department"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Department
                    </label>
                    <Controller
                      control={control}
                      name={`section.${index}.department`}
                      render={({ field }) => {
                        return (
                          <Select onValueChange={field.onChange} {...field}>
                            <SelectTrigger className="w-auto ">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value={'maths'}>maths</SelectItem>
                                <SelectItem value={'Biology'}>
                                  Biology
                                </SelectItem>
                                <SelectItem value={'commerce'}>
                                  commerce
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        );
                      }}
                    ></Controller>
                  </div>
                  <Button
                    className=" outline-danger"
                    variant="outline"
                    onClick={() => {
                      remove(parseInt(row.id));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                className=""
                variant="ghost"
                onClick={() => {
                  append({ section: 'section' });
                }}
              >
                Add Section
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
