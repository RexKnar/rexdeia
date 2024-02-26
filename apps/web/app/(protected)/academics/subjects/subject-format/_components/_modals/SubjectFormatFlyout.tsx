'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
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

import { CreateSubjectFormatModel } from '../../../../../../../lib/domain/subject';
import { useCreateSubjectFormatMutationQuery } from '../../../../../../../lib/queries/subject-format/useCreateSubjectFormatMutationQuery';
import { useGetSubjectFormatByIdQuery } from '../../../../../../../lib/queries/subject-format/useGetSubjectFormatByIdQuery';
import { useUpdateSubjectFormatMutationQuery } from '../../../../../../../lib/queries/subject-format/useUpdateSubjectFormatMutationQuery';

export function SubjectFormatFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectFormatId = searchParams.get('subjectFormatId');
  const isOpen = searchParams.get('isSubjectFormatFlyoutOpen') === 'true';

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

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
    isPending: isPendingCreateSubjectFormat,
    mutateAsync: mutateCreateSubjectFormateAsync,
  } = useCreateSubjectFormatMutationQuery();

  const closeSubjectFormatFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isSubjectFormatFlyoutOpen', 'false');
    params.delete('subjectFormatId');
    router.replace(pathname + '?' + params.toString());
  };

  const { data: getSubjectFormatByIdRespone } = useGetSubjectFormatByIdQuery(
    subjectFormatId,
    {
      enabled: !!subjectFormatId,
    }
  );

  useEffect(() => {
    if (getSubjectFormatByIdRespone) {
      const { name, isActive } = getSubjectFormatByIdRespone;

      setValue('name', name);
      setValue('isActive', isActive);
    } else {
      setValue('name', null);
      setValue('isActive', false);
    }
  }, [getSubjectFormatByIdRespone, setValue]);

  const {
    isPending: isPendingUpdateSubjectFormat,
    mutateAsync: mutateUpdateSubjectFormatAsync,
  } = useUpdateSubjectFormatMutationQuery(page, limit);

  async function saveSubjectFormat(payload: CreateSubjectFormatModel) {
    try {
      if (subjectFormatId) {
        const updateSubjectFormatRequestPayload = {
          ...payload,
          id: subjectFormatId,
        };
        await mutateUpdateSubjectFormatAsync(updateSubjectFormatRequestPayload);
      } else {
        const requestPayload = {
          ...payload,
        };
        await mutateCreateSubjectFormateAsync(requestPayload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setValue('isActive', false);

      await closeSubjectFormatFlyout();
      reset();
    }
  }

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeSubjectFormatFlyout()}
        >
          <form onSubmit={handleSubmit(saveSubjectFormat)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      {subjectFormatId
                        ? 'Update Subject Format'
                        : 'Add Subject Format'}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      id="isActive"
                      {...register('isActive')}
                      onCheckedChange={(value) => setValue('isActive', value)}
                      checked={watch('isActive')}
                    />
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
                  Subject Format Name
                </label>
                <Input
                  {...register('name', {
                    required: 'Name is Required',
                  })}
                  id="name"
                  autoFocus
                  type="text"
                  className="mt-2"
                  placeholder="Enter Subject Format Name"
                  errorMessage={fieldErrors?.name?.message.toString()}
                />
              </div>
              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  disabled={
                    isPendingCreateSubjectFormat || isPendingUpdateSubjectFormat
                  }
                  aria-disabled={
                    isPendingCreateSubjectFormat || isPendingUpdateSubjectFormat
                  }
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingCreateSubjectFormat ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Saving
                    </div>
                  ) : (
                    `${subjectFormatId ? 'Update' : 'Save'}`
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
