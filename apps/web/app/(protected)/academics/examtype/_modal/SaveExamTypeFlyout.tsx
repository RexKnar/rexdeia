// import { CreateExamTypeModel } from 'lib/domain/exam';
import { useCreateExamTypeMutationQuery } from 'lib/queries/examtype/useCreateExamTypeMutationQuery';
import { PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Switch,
  Text,
} from 'ui';

import { useQueryParams } from '@/hooks/useQueryParams';

export function SaveExamTypeFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getParam } = useQueryParams();
  const page = parseInt(getParam('page')) || 1;
  const limit = parseInt(getParam('limit')) || 999;
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: null,
      isActive: false,
    },
  });

  const isOpen = searchParams.get('isExamTypeFlyoutOpen') === 'true';

  const {
    isPending: isPendingCreateExamType,
    mutateAsync: mutateCreateExamTypeAsync,
  } = useCreateExamTypeMutationQuery({ page, limit });

  const closeExamTypeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isExamTypeFlyoutOpen', 'false');
    params.delete('examtypeId');
    router.replace(pathname + '?' + params.toString());
  };
  // const { data: getMediumByIdResponse } = useGetMediumByIdQuery(examTypeId, {
  //   enabled: !!examTypeId,
  // });

  // async function saveExamType(payload: CreateExamTypeModel) {
  //   try {
  //     if (examTypeId) {
  //       const updateBatchRequestPayload = {
  //         ...payload,
  //         id: examTypeId,
  //       };
  //       await mutateUpdateMediumAsync(updateBatchRequestPayload);
  //     } else {
  //       const requestPayload = {
  //         ...payload,
  //       };
  //       await mutateCreateMediumAsync(requestPayload);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setValue('isActive', false);
  //     closeMediumFlyout();
  //     reset();
  //   }
  // }
  function saveExamType(payload) {
    mutateCreateExamTypeAsync(payload);
  }
  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeExamTypeFlyout()}
        >
          <form onSubmit={handleSubmit(saveExamType)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      {'Add Exam Type'}
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
                  Exam Type Name
                </label>
                <Input
                  {...register('name', {
                    required: 'name is Required',
                  })}
                  autoFocus
                  className="mt-2"
                  id="name"
                  errorMessage={fieldErrors?.name?.message.toString()}
                />
              </div>
            </div>
            <div className="mt-2">
              <label
                htmlFor="examType"
                className="text-sm font-semibold text-gray-700"
              >
                Frequency
              </label>
              <div className="mt-2">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={'one'}>Value One</SelectItem>
                      <SelectItem value={'two'}>Value Two</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-10">
              {!isPendingCreateExamType ? (
                <Button
                  size="lg"
                  variant="default"
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {'Save'}
                </Button>
              ) : (
                'saving'
              )}
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
