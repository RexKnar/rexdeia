'use client';

import { useGetRoleDetailsByIdQuery } from 'lib/queries/role-management/useGetRoleDetailsByIdQuery';
import { useUpdateRoleByIdMutationQuery } from 'lib/queries/role-management/useUpdateRoleByIdMutationQuery';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
  useToast,
} from 'ui';

export function EditRoleManagementFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isEditRoleFlyoutOpen') === 'true';
  const roleId = searchParams.get('roleId');
  const { toast } = useToast();

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isEditRoleFlyoutOpen', 'false');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: '',
      name: '',
      moduleAccess: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'moduleAccess',
  });

  const { mutateAsync: updateRoleMutation } = useUpdateRoleByIdMutationQuery();

  const { data: getRoleByIdResponse } = useGetRoleDetailsByIdQuery(roleId, {
    enabled: !!roleId,
    queryKey: ['roleDetails', roleId],
  });

  useEffect(() => {
    if (getRoleByIdResponse) {
      const { id, name, moduleAccess } = getRoleByIdResponse;
      setValue('id', id);
      setValue('name', name);
      setValue('moduleAccess', moduleAccess);
    }
  }, [getRoleByIdResponse, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateRoleMutation(values);
      toast({
        title: 'Success',
        description: 'Role updated successfully!',
      });
      closeFlyout();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role',
        variant: 'destructive',
      });
    }
  });

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={closeFlyout}
        >
          <form onSubmit={onSubmit} className="max-h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="mb-5 flex items-center">
                <Text variant="lg-semibold" className="ml-2">
                  Update Role
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
                autoFocus
                className="mt-2"
                placeholder="Role Name"
                errorMessage={errors?.name?.message?.toString()}
              />
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="mt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Controller
                    name={`moduleAccess.${index}.module`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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

            <div className="mt-10 text-center">
              <Button type="submit" size="lg" className="px-12 py-4">
                Save
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
