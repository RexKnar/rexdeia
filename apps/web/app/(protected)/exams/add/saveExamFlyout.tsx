'use client';

import { CreateExamModel } from 'lib/domain/exam';
import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { useCreateExamMutationQuery } from 'lib/queries/exams/useCreateExamMutationQuery';
import { useGetExamDetailQuery } from 'lib/queries/exams/useGetExamDetailQuery';
import { useGetExamTypeListQuery } from 'lib/queries/exams/useGetExamTypeListQuery';
import { useUpdateExamDetailMutationQuery } from 'lib/queries/exams/useUpdateExamDetailMutationQuery';
import { useGetTermsListQuery } from 'lib/queries/term/useGetTermListQuery';
import { Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
  Spinner,
  Switch,
  Text,
} from 'ui';

import { useQueryParams } from '@/hooks/useQueryParams';

export function SaveExamFlyout() {
  const { getParam, removeParams } = useQueryParams();
  const router = useRouter();

  const examId = getParam('examId');
  const isOpen = getParam('isSaveExamFlyoutOpen') === 'true';

  const page = parseInt(getParam('page')) || 1;
  const limit = parseInt(getParam('limit')) || 999;
  const filter = { isActive: true };
  const closeFlyout = async () => {
    removeParams(['isSaveExamFlyoutOpen', 'examId']);
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      closeFlyout();
    }
  };
  const {
    reset,
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: '',
      isActive: false,
      termId: '',
      examTypeId: '',
      academicYearId: '',
    },
  });

  const { data: termListResponse, isLoading: isTermListLoading } =
    useGetTermsListQuery({
      page,
      limit,
      filter,
    });
  const { data: examTypeListResponse, isLoading: isExamTypeListLoading } =
    useGetExamTypeListQuery({
      page,
      limit,
      filter,
    });

  const {
    data: academicYearListResponse,
    isLoading: isAcademicYearListLoading,
  } = useGetBatchesListQuery({
    page,
    limit,
    filter,
  });

  const { data: examDetail, isLoading: getExamLoading } = useGetExamDetailQuery(
    { examId },
    { enabled: !!examId }
  );

  useEffect(() => {
    if (examDetail) {
      setValue('name', examDetail.name);
      setValue('termId', examDetail.term.id);
      setValue('examTypeId', examDetail.examType.id);
      setValue('academicYearId', examDetail.batch.id);
      setValue('isActive', examDetail.isActive);
    }
  }, [examDetail]);

  const { isPending: isPendingCreateExam, mutateAsync: mutateCreateExamAsync } =
    useCreateExamMutationQuery(page, limit);

  const { isPending: isPendingUpdateExam, mutateAsync: mutateUpdateExamAsync } =
    useUpdateExamDetailMutationQuery(page, limit);

  async function saveExam(payload: CreateExamModel) {
    try {
      const requestPayload = {
        ...payload,
        isActive: Boolean(payload.isActive),
      };
      if (examId) {
        const updateExamRequestPayload = {
          ...requestPayload,
          id: examId,
        };
        await mutateUpdateExamAsync(updateExamRequestPayload);
      } else {
        const response = await mutateCreateExamAsync(requestPayload);
        if (response) {
          router.push(`/academics/exams/${response.id}/configuration/add`);
          setValue('isActive', false);
          reset();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section>
      <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => {
            removeParams(['examId', 'isSaveExamFlyoutOpen']);
          }}
        >
          {!termListResponse &&
          !examTypeListResponse &&
          !academicYearListResponse ? (
            <section className="flex h-96 w-full flex-col items-center justify-center gap-4">
              <Spinner />
              <p>No data found</p>
            </section>
          ) : (
            <form onSubmit={handleSubmit(saveExam)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        {examId ? 'Update Exam' : 'Add Exam'}
                      </Text>
                    </div>
                    <div className="flex items-center">
                      <Switch
                        id="isActive"
                        checked={watch('isActive')}
                        {...register('isActive')}
                        onCheckedChange={(value) => setValue('isActive', value)}
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

              {examId && getExamLoading ? (
                <div className="flex h-96 w-full flex-col items-center justify-center gap-4">
                  <Spinner />
                  <p>Loading...</p>
                </div>
              ) : (
                <div className="mt-5">
                  <div className="mt-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Exam Name
                    </label>
                    <Input
                      value={watch('name')}
                      {...register('name', {
                        required: 'Name is Required',
                      })}
                      id="name"
                      autoFocus
                      type="text"
                      className="mt-2"
                      placeholder="Enter Exam Name"
                      errorMessage={fieldErrors?.name?.message.toString()}
                    />
                  </div>
                  <div>
                    {!isTermListLoading ? (
                      <div className="mt-2">
                        <label
                          htmlFor="term"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Term
                        </label>
                        <Select
                          autoComplete="off"
                          value={watch('termId')}
                          {...register('termId')}
                          onValueChange={(value) => {
                            if (value) {
                              setValue('termId', value);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {termListResponse.data.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <h2>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                        Loading...
                      </h2>
                    )}
                  </div>
                  <div>
                    {!isExamTypeListLoading ? (
                      <div className="mt-2">
                        <label
                          htmlFor="examType"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Exam Type
                        </label>
                        <Select
                          autoComplete="off"
                          value={watch('examTypeId')}
                          {...register('examTypeId')}
                          onValueChange={(value) => {
                            if (value) {
                              setValue('examTypeId', value);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {examTypeListResponse.data.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <h2>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                        Loading...
                      </h2>
                    )}
                  </div>
                  <div>
                    {!isAcademicYearListLoading ? (
                      <div className="mt-2">
                        <label
                          htmlFor="academicYear"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Academic Year
                        </label>
                        <Select
                          autoComplete="off"
                          value={watch('academicYearId')}
                          {...register('academicYearId')}
                          onValueChange={(value) => {
                            if (value) {
                              setValue('academicYearId', value);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {academicYearListResponse.data.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <h2>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                        Loading...
                      </h2>
                    )}
                  </div>
                  <div className="mt-10">
                    <Button
                      size="lg"
                      variant="default"
                      disabled={isPendingCreateExam || isPendingUpdateExam}
                      aria-disabled={isPendingCreateExam}
                      className="mx-auto flex justify-center px-12 py-4"
                    >
                      {isPendingCreateExam ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                          Saving
                        </div>
                      ) : (
                        `${examId ? 'Update' : 'Save'}`
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
