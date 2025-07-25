'use client';

import { useAssignUsersToRoleQuery } from 'lib/queries/role-management/assignUsers/useAssignUsersToRoleQuery';
import { useGetAllStaffListQuery } from 'lib/queries/staff/useGetAllStaffListQuery';
import { PlusCircle, Trash } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React, { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, Text } from 'ui';

import { SearchableSelect } from '@/components/SearchableSelect';

type FormValues = {
  users: { userId: string }[];
};

export function AssignUsersRoleFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isAssignUsersOpen') === 'true';
  // const roleId = searchParams.get('roleId');
  const roleId = useParams<{ roleId: string }>().roleId;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      users: [{ userId: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users',
  });

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isAssignUsersOpen', 'false');
    router.replace(pathname + '?' + params.toString());
  };

  const { data: getStaffListResponse } = useGetAllStaffListQuery({
    page: 1,
    limit: 9999,
    searchTerm: searchParams.get('search') || '',
  });

  const { mutateAsync: mutateAssignUsersToRoleAsync } =
    useAssignUsersToRoleQuery(roleId);

  useEffect(() => {
    if (isOpen && fields.length === 0) {
      append({ userId: '' });
    }
  }, [isOpen, fields.length, append]);

  const onSubmit = async (data: FormValues) => {
    const userIds = data.users.map((user) => user.userId);
    const response = await mutateAssignUsersToRoleAsync({ userIds });
    if (response) {
      closeFlyout();
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
          onCloseClick={closeFlyout}
        >
          <div className="max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Add More Users
                    </Text>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300" />
              </SheetHeader>

              {fields.map((field, index) => (
                <div key={field.id} className="flex w-full gap-2">
                  <div className="ml-9 mt-5 w-full">
                    <Controller
                      name={`users.${index}.userId`}
                      control={control}
                      rules={{ required: 'Staff selection is required' }}
                      render={({ field }) => (
                        <SearchableSelect
                          label="Staff Name"
                          value={field.value}
                          onChange={field.onChange}
                          options={
                            getStaffListResponse?.data?.map((item) => ({
                              id: item.userId,
                              name: `${item.firstName} ${item.lastName}`,
                            })) || []
                          }
                          placeholder="Select Staff"
                        />
                      )}
                    />
                    {errors.users?.[index]?.userId && (
                      <p className="text-sm text-red-600">
                        {errors.users[index]?.userId?.message}
                      </p>
                    )}
                  </div>
                  {fields.length > 1 && (
                    <div className="my-auto">
                      <Button
                        className="border-transparent bg-red-600 px-2"
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        <Trash size={20} className="text-white" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-5">
                <Button
                  size="sm"
                  variant="outline"
                  className="mx-auto flex justify-center px-4 py-2"
                  type="button"
                  onClick={() => append({ userId: '' })}
                >
                  <Text variant="sm-bold" className="text-center text-primary">
                    Add more user
                  </Text>
                </Button>
              </div>

              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  className="mx-auto flex justify-center px-12 py-4"
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
