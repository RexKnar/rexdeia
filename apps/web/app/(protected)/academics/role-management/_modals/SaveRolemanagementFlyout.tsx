'use client';

import { Plus, PlusCircle, Trash } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from 'ui';

export function RoleManagementFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isGradeFlyoutOpen') === 'true';

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      roleName: '',
      roles: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roles',
  });

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isGradeFlyoutOpen', 'false');
    router.replace(pathname + '?' + params.toString());
    reset();
  };

  const SaveGrade = (data: any) => {
    console.log('Form Data:', data);
    closeFlyout();
  };

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="p-10 bg-white"
          onCloseClick={closeFlyout}
        >
          <div className="max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit(SaveGrade)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="flex items-center gap-2">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold">New Role Management</Text>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300" />
              </SheetHeader>

              <div className="mt-5">
                <label
                  className="text-sm font-semibold text-gray-700"
                  htmlFor="roleName"
                >
                  Role Name
                </label>
                <Input
                  {...register('roleName')}
                  className="mt-2"
                  id="roleName"
                />
              </div>

              <div className="mt-5">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => append({ role: '', permissions: [] })}
                >
                  <Plus size={18} className="mr-2" />
                  Add Role
                </Button>
              </div>

              {fields.map((field, index) => (
                <section key={field.id} className="pt-4 mt-6 border-t">
                  <div className="flex items-center gap-2">
                    <Select
                      onValueChange={(value) =>
                        control.setValue(`roles.${index}.role`, value)
                      }
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="bg-red-600"
                      onClick={() => remove(index)}
                    >
                      <Trash size={18} className="text-white" />
                    </Button>
                  </div>

                  <div className="flex justify-between mt-4">
                    {['Read', 'Create', 'Update', 'Delete'].map((perm) => (
                      <div key={perm}>
                        <Checkbox
                          {...register(`roles.${index}.permissions`)}
                          value={perm}
                        />
                        <label className="ml-2 text-sm font-medium">
                          {perm}
                        </label>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  className="flex justify-center px-12 py-4 mx-auto"
                  type="submit"
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
