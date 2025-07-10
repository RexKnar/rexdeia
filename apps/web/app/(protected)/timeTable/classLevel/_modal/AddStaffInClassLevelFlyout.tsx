'use client';

import { useAssignStaffToClassLevelMutationQuery } from 'lib/queries/classLevel/incharge/useAssignStaffToClassLevelMutationQuery.ts';
import { useGetAllStaffListQuery } from 'lib/queries/staff/useGetAllStaffListQuery';
import { Loader2, PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
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

import { useQueryParams } from '@/hooks/useQueryParams';

export function AddStaffInClassLevelFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getParam } = useQueryParams();
  const page = parseInt(getParam('page')) || 1;
  const limit = parseInt(getParam('limit')) || 10;

  const classLevelId = searchParams.get('classLevelId');
  const isOpen = searchParams.get('isStaffClassLevelFlyoutOpen') === 'true';

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      staffId: '',
    },
  });

  const { data: staffList } = useGetAllStaffListQuery({ page, limit });

  const { mutateAsync: assignStaffToClassLevel, isPending } =
    useAssignStaffToClassLevelMutationQuery(page, limit);

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isStaffClassLevelFlyoutOpen', 'false');
    params.delete('classLevelId');
    router.replace(`${pathname}?${params.toString()}`);
    reset();
  };

  const onSubmit = async (data: any) => {
    if (!classLevelId || !data.staffId) return;
    try {
      await assignStaffToClassLevel({
        classLevelId,
        staffId: data.staffId,
      });
    } catch (error) {
      console.error(error);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle className="mb-5 flex items-center">
              <PlusCircle size={20} strokeWidth={1.5} />
              <Text variant="lg-semibold" className="ml-2">
                Assign Staff to Class Level
              </Text>
            </SheetTitle>
            <hr className="border-t border-gray-300" />
          </SheetHeader>

          <div className="mt-5">
            <label
              htmlFor="staffId"
              className="text-sm font-semibold text-gray-700"
            >
              Select Staff
            </label>
            <Controller
              control={control}
              name="staffId"
              rules={{ required: 'Please select a staff' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select staff..." />
                  </SelectTrigger>
                  <SelectContent>
                    {staffList?.data.map((staff: any) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.firstName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.staffId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.staffId.message as string}
              </p>
            )}
          </div>

          <div className="mt-10 text-center">
            <Button
              size="lg"
              className="px-12 py-4"
              disabled={isPending}
              aria-disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                  Saving
                </div>
              ) : (
                'Assign Staff'
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
