'use client';
import { InstituteCourseFAQModel } from 'lib/domain/institute/course';
import { useCreateCourseFAQMutationQuery } from 'lib/queries/institute/course/faq/useCreateCourseFAQMutationQuery';
import { Loader2, PlusCircle } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Spinner,
  Text,
  Textarea,
} from 'ui';

import { useQueryParams } from '@/hooks/useQueryParams';

export function AddCourseFAQFlyout() {
  const { getParam, removeParams } = useQueryParams();
  const searchParams = useSearchParams();
  const routeParams = useParams<{ courseId: string }>();

  const courseId = searchParams.get('courseId') || routeParams.courseId;
  const isOpen = getParam('isAddCourseFAQFlyoutOpen') === 'true';

  const {
    isPending: isPendingCreateCourseFAQ,
    mutateAsync: mutateCreateCourseFAQAsync,
  } = useCreateCourseFAQMutationQuery(courseId);

  const closeFlyout = async () => {
    removeParams(['isAddCourseFAQFlyoutOpen']);
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      closeFlyout();
    }
  };

  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<InstituteCourseFAQModel>({
    defaultValues: {
      question: '',
      answer: '',
    },
  });

  const saveCourseFAQ = async (payload: InstituteCourseFAQModel) => {
    try {
      const response = await mutateCreateCourseFAQAsync(payload);
      if (response) {
        reset();
        closeFlyout();
      }
    } catch (error) {
      console.error('Error creating FAQ:', error);
    }
  };

  return (
    <section>
      <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => removeParams(['isAddCourseFAQFlyoutOpen'])}
        >
          {courseId == '2' ? (
            <section className="flex h-96 w-full flex-col items-center justify-center gap-4">
              <Spinner />
              <p>No data found</p>
            </section>
          ) : (
            <form onSubmit={handleSubmit(saveCourseFAQ)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Add New FAQ
                    </Text>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300" />
              </SheetHeader>

              <div className="mt-5">
                <div className="mt-2">
                  <label
                    htmlFor="question"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Question
                  </label>
                  <Input
                    value={watch('question')}
                    {...register('question', {
                      required: 'Question is required',
                    })}
                    id="question"
                    autoFocus
                    type="text"
                    className="mt-2"
                    placeholder="Enter question"
                    errorMessage={fieldErrors?.question?.message?.toString()}
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="answer"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Answer
                  </label>
                  <Textarea
                    {...register('answer', {
                      required: 'Answer is required',
                    })}
                    className="mt-2"
                    id="answer"
                    placeholder="Enter answer"
                    errorMessage={fieldErrors?.answer?.message?.toString()}
                  />
                </div>
                <div className="mt-10">
                  <Button
                    size="lg"
                    variant="default"
                    disabled={isPendingCreateCourseFAQ}
                    aria-disabled={isPendingCreateCourseFAQ}
                    className="mx-auto flex justify-center px-12 py-4"
                  >
                    {isPendingCreateCourseFAQ ? (
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
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
