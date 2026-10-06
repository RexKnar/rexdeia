'use client';

import { SYSTEM_MODULES } from 'lib/constants/modules';
import { AddRoleModel } from 'lib/domain/role';
import { useCreateRoleMutationQuery } from 'lib/queries/role-management/useCreateRoleMutationQuery';
import { Plus, PlusCircle, Trash } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
} from 'ui';

const ROLE_ARCHETYPES = [
  { value: 'CUSTOM', label: 'Custom (Default)' },
  { value: 'ORGANIZATION_ADMIN', label: 'Organization Admin' },
  { value: 'BRANCH_MANAGER', label: 'Branch Manager' },
  { value: 'HM', label: 'Headmaster / HM' },
  { value: 'AHM', label: 'Assistant Headmaster / AHM' },
  { value: 'CLASS_TEACHER', label: 'Class Teacher' },
  { value: 'TEACHING_STAFF', label: 'Teaching Staff' },
  { value: 'FINANCE_OFFICER', label: 'Finance Officer' },
  { value: 'HR_OFFICER', label: 'HR Officer' },
  { value: 'INSTRUCTOR', label: 'Instructor / LMS' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'STUDENT', label: 'Student' },
];

export function RoleFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isRoleFlyoutOpen') === 'true';

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      archetype: 'CUSTOM',
      isActive: false,
      moduleAccess: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'moduleAccess',
  });

  const { mutateAsync: createRole, isPending } = useCreateRoleMutationQuery();

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isRoleFlyoutOpen', 'false');
    router.replace(`${pathname}?${params.toString()}`);
    reset();
  };

  const saveRole = async (data: any) => {
    try {
      const payload: AddRoleModel = {
        name: data.name,
        archetype: data.archetype || 'CUSTOM',
        moduleAccess: data.moduleAccess.map((mod: any) => ({
          module: mod.module,
          scope: mod.scope,
          create: !!mod.create,
          read: !!mod.read,
          update: !!mod.update,
          delete: !!mod.delete,
        })),
      };
      await createRole(payload);
    } catch (err) {
      console.error(err);
    } finally {
      closeFlyout();
    }
  };

  return (
    <Sheet open={isOpen}>
      <SheetContent
        side="right"
        widthSize="sm"
        className="bg-white p-10"
        onCloseClick={closeFlyout}
      >
        <form onSubmit={handleSubmit(saveRole)}>
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
              errorMessage={errors?.name?.message}
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-700">
              Base Archetype
            </label>
            <Controller
              name="archetype"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || 'CUSTOM'}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="Select Archetype" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_ARCHETYPES.map((arch) => (
                      <SelectItem key={arch.value} value={arch.value}>
                        {arch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
                        {Object.values(SYSTEM_MODULES).map((mod) => (
                          <SelectItem key={mod.key} value={mod.key}>
                            {mod.label} ({mod.domain})
                          </SelectItem>
                        ))}
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
      </SheetContent>
    </Sheet>
  );
}
