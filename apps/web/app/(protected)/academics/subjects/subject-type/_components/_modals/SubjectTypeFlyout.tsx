'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Switch,
  Text,
} from 'ui';

import { CreateSubjectTypeModel } from '../../../../../../../lib/domain/subject';
import { useCreateSubjectTypeMutationQuery } from '../../../../../../../lib/queries/subject-type/useCreateSubjectTypeMutationQuery';

export function SubjectTypeFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isSubjectTypeFlyoutOpen') === 'true';

  const {
    register,
    setValue,
    reset,
    watch,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: null,
      isActive: false,
    },
  });

  const {
    isPending: isPendingCreateSubjectType,
    mutateAsync: mutateCreateSubjectTypeAsync,
  } = useCreateSubjectTypeMutationQuery();

  const closeSubjectTypeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isSubjectTypeFlyoutOpen', 'false');
    reset();
    router.replace(pathname + '?' + params.toString());
  };

  async function saveSubjectType(payload: CreateSubjectTypeModel) {
    try {
      const requestPayload = {
        ...payload,
      };
      mutateCreateSubjectTypeAsync(requestPayload);
    } catch (error) {
      console.error(error);
    } finally {
      reset();
      closeSubjectTypeFlyout();
    }
  }
  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeSubjectTypeFlyout()}
        >
          <form onSubmit={handleSubmit(saveSubjectType)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Add Subject Type
                    </Text>
                  </div>
                  <div className="ml-14 flex items-center">
                    <Switch
                      id="isActive"
                      {...register('isActive')}
                      onCheckedChange={(value) => setValue('isActive', value)}
                      checked={watch('isActive')}
                    />
                  </div>
                  <div className="flex items-center">
                    <label
                      htmlFor="isActive"
                      className="ml-2 text-sm font-semibold"
                    >
                      {watch('isActive') ? 'Active' : 'Inactive'}
                    </label>
                  </div>
                </div>
              </SheetTitle>
              <hr className="border-t border-gray-300"></hr>
            </SheetHeader>

            <div className="mt-5">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Subject Type Name
                </label>
                <Input
                  {...register('name')}
                  id="name"
                  autoFocus
                  type="text"
                  className="mt-2"
                  placeholder="Enter Subject Type Name"
                  errorMessage={fieldErrors?.name?.message.toString()}
                />
              </div>
              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  disabled={isPendingCreateSubjectType}
                  aria-disabled={isPendingCreateSubjectType}
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingCreateSubjectType ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Saving
                    </div>
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
