'use client';

import { useCreateRoleModuleAccessQuery } from 'lib/queries/role-management/useCreateRoleModuleAccessMutationQuery';
import { Plus, PlusCircle, Trash } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
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

export function AddRoleModuleFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleId = searchParams.get('roleId');
  const isOpen = searchParams.get('isAddRoleModuleFlyoutOpen') === 'true';

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      moduleAccess: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'moduleAccess',
  });

  const { mutateAsync: createRoleModuleAccess, isPending } =
    useCreateRoleModuleAccessQuery();

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isAddRoleModuleFlyoutOpen', 'false');
    router.replace(`${pathname}?${params.toString()}`);
    reset();
  };

  const saveRole = async (data) => {
    try {
      if (!roleId) throw new Error('Role ID missing');

      const payload = {
        roleId,
        moduleAccess: data.moduleAccess.map((mod) => ({
          module: mod.module,
          create: !!mod.create,
          read: !!mod.read,
          update: !!mod.update,
          delete: !!mod.delete,
        })),
      };

      await createRoleModuleAccess(payload);
    } catch (err) {
      console.error('Failed to add role module access', err);
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
                Add New Role Module
              </Text>
            </SheetTitle>
            <hr className="border-t border-gray-300" />
          </SheetHeader>

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
      </SheetContent>
    </Sheet>
  );
}
