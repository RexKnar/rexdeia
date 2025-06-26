'use client';

import { Plus, PlusCircle, Trash } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useCreateRoleMutationQuery } from 'lib/queries/role-management/useCreateRoleMutationQuery';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Checkbox,
  Sheet,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Slider,
  Switch,
  Text,
} from 'ui';

import { useCreateGradeMutationQuery } from '../../../../../lib/queries/grade/useCreateGradeMutationQuery';

export function EditRoleManagementFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isEditRoleFlyoutOpen') === 'true';
  const [sliderValues, setSliderValues] = useState([[0, 100]]);
  const [errorMessages, setErrorMessages] = useState([false]);

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
      name: '',
      isActive: false,
      moduleAccess: [],
    }
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
    name: 'moduleAccess',
  });

  const {
    isPending: isPendingCreateGrade,
    mutateAsync: mutateCreateGradeAsync,
  } = useCreateGradeMutationQuery();

  const { mutateAsync: createRole, isPending } = useCreateRoleMutationQuery();

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isEditRoleFlyoutOpen', 'false');
    router.replace(pathname + '?' + params.toString());
    setSliderValues([[0, 100]]);
    setErrorMessages([false]);
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
            <form>
              <SheetHeader>
                <SheetTitle className="mb-5 flex items-center">
                  <PlusCircle size={20} strokeWidth={1.5} />
                  <Text variant="lg-semibold" className="ml-2">
                    New Role Management
                  </Text>
                </SheetTitle>
                <hr className="border-t border-gray-300" />
              </SheetHeader>
              <div className="mt-5">
                <label className="text-sm font-semibold text-gray-700">
                  Role Name
                </label>
                <Input
                  {...register('name', { required: 'Role name is required' })}
                  className="mt-2"
                  autoFocus
                  errorMessage={fieldErrors?.name?.message}
                />
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="mt-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Controller
                      name={`moduleAccess.${index}.module`}
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select Module" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Analytics">Analytics</SelectItem>
                            <SelectItem value="Class">Class</SelectItem>
                            <SelectItem value="Students">Students</SelectItem>
                            <SelectItem value="Staffs">Staffs</SelectItem>
                            <SelectItem value="Exams">Exams</SelectItem>
                            <SelectItem value="Configurations">
                              Configurations
                            </SelectItem>
                            <SelectItem value="TimeTable">TimeTable</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />

                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <Trash size={18} />
                    </Button>
                  </div>

                  <div className="flex justify-between">
                    {['create', 'read', 'update', 'delete'].map((perm) => (
                      <Controller
                        key={perm}
                        control={control}
                        name={`moduleAccess.${index}.${perm}`}
                        render={({ field }) => (
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={field.value || false}
                              onCheckedChange={(val) => field.onChange(!!val)}
                            />
                            <span className="text-sm capitalize">{perm}</span>
                          </label>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <Button
                className="mt-5"
                variant="default"
                type="button"
                onClick={() =>
                  append({
                    module: '',
                    create: false,
                    read: false,
                    update: false,
                    delete: false,
                  })
                }
              >
                <Plus size={18} className="mr-1" /> Add Module
              </Button>

              <div className="mt-10 text-center">
                <Button
                  type="submit"
                  size="lg"
                  className="px-12 py-4"
                  disabled={isPending}
                >
                  {isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
