'use client';

import { useUpdateUserPasswordMutation } from 'lib/queries/users/useUpdateUserPasswordMutationQuery';
import { Lock } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
  ToastProvider,
  ToastViewport,
  useToast,
} from 'ui';

const EditUserPasswordFlyOut = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isUserPasswordFlyoutOpen') === 'true';
  const { toast } = useToast();

  const updatePassword = useUpdateUserPasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isUserPasswordFlyoutOpen', 'false');
    router.replace(pathname + '?' + params.toString());
  };

  const onSubmit = (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'New password and confirm password do not match',
      });
      return;
    }

    updatePassword.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast({
            variant: 'success',
            title: 'Success',
            description: 'Password updated successfully!',
          });
          reset();
          closeFlyout();
        },
        onError: (error) => {
          toast({
            variant: 'error',
            title: 'Error',
            description: error.message || 'Failed to update password',
          });
        },
      }
    );
  };

  return (
    <ToastProvider>
      <ToastViewport />
      <section>
        <Sheet open={isOpen}>
          <SheetContent
            side="right"
            widthSize="sm"
            className="bg-white "
            onCloseClick={closeFlyout}
          >
            <SheetHeader>
              <SheetTitle className="flex items-center ">
                <Lock size={20} strokeWidth={1.5} />
                <Text variant="lg-semibold" className="ml-2">
                  Change Password
                </Text>
              </SheetTitle>
              <hr className="mb-6 border-t border-gray-300" />
            </SheetHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <Input
                type="password"
                aria-invalid={errors.name ? 'true' : 'false'}
                errorMessage={errors?.name?.message.toString()}
                placeholder="Current Password"
                {...register('currentPassword', {
                  required: 'Current password is required',
                })}
              />
              <Input
                type="password"
                aria-invalid={errors.name ? 'true' : 'false'}
                errorMessage={errors?.name?.message.toString()}
                placeholder="New Password"
                {...register('newPassword', {
                  required: 'New password is required',
                })}
              />

              <Input
                type="password"
                placeholder="Confirm Password"
                aria-invalid={errors.name ? 'true' : 'false'}
                errorMessage={errors?.name?.message.toString()}
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                })}
              />

              <div className="flex justify-end gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={closeFlyout}
                  disabled={updatePassword.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updatePassword.isPending}>
                  {updatePassword.isPending ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </section>
    </ToastProvider>
  );
};

export default EditUserPasswordFlyOut;
