'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
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

import { UpdateClassModel } from '../../../../../../lib/domain/class';
import { useUpdateClassMutationQuery } from '../../../../../../lib/queries/class/use UpdateClassMutationQuery';
import { useGetClassByIdQuery } from '../../../../../../lib/queries/class/useGetClassByIdQuery';

export function UpdateClassFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      isActive: false,
      name: null,
    },
  });

  const isOpen = searchParams.get('isUpdateClassFlyoutOpen') === 'true';

  const params = useParams<{ id: string }>();

  const { data: geClassByIdResponse } = useGetClassByIdQuery(params.id, {
    enabled: !!params.id,
  });

  useEffect(() => {
    if (geClassByIdResponse) {
      const { name, isActive } = geClassByIdResponse;

      setValue('name', name);
      setValue('isActive', isActive);
    } else {
      setValue('name', null);
      setValue('isActive', false);
    }
  }, [geClassByIdResponse, setValue]);

  const {
    isPending: isPendingUpdateClass,
    mutateAsync: mutateUpdateClassAsync,
  } = useUpdateClassMutationQuery(params.id);

  async function updateClass(payload: UpdateClassModel) {
    try {
      const updateClassPayload = {
        ...payload,
        id: params.id,
      };
      mutateUpdateClassAsync(updateClassPayload);
    } catch (error) {
      console.error(error);
    } finally {
      setValue('isActive', false);
      reset();
      const params = new URLSearchParams(searchParams);
      params.set('isUpdateClassFlyoutOpen', 'false');
      params.delete('regulationId');

      router.replace(pathname + '?' + params.toString());
    }
  }

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set('isUpdateClassFlyoutOpen', 'false');
            params.delete('regulationId');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          <form onSubmit={handleSubmit(updateClass)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Update Class
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
                  Class Name
                </label>
                <Input
                  {...register('name', {
                    required: 'Class Name is Required',
                  })}
                  className="mt-2"
                  id="name"
                  errorMessage={fieldErrors?.name?.message.toString()}
                />
              </div>
              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  disabled={isPendingUpdateClass}
                  aria-disabled={isPendingUpdateClass}
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isPendingUpdateClass ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                      Updating
                    </div>
                  ) : (
                    'Update'
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
