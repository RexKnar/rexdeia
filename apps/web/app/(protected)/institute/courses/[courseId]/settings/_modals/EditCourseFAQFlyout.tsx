'use client';

import { updateCourseFAQRequestModel } from 'lib/domain/institute/course';
import { useUpdateCourseFAQMutationQuery } from 'lib/queries/institute/course/faq/useUpdateCourseFAQMutationQuery';
import { Lock } from 'lucide-react';
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
  Text,
  Textarea,
  ToastProvider,
  ToastViewport,
  useToast,
} from 'ui';

type FormValues = updateCourseFAQRequestModel & { id: string };

const EditCourseFAQFlyOut = ({
  courseId,
  initialData,
}: {
  courseId: string;
  initialData?: FormValues;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isUpdateCourseFAQFlyoutOpen') === 'true';
  const { toast } = useToast();
  const updateFAQ = useUpdateCourseFAQMutationQuery(courseId, initialData.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isUpdateCourseFAQFlyoutOpen', 'false');
    router.replace(pathname + '?' + params.toString());
  };

  const onSubmit = (data: FormValues) => {
    updateFAQ.mutate(
      {
        ...data,
        instituteCourseId: courseId,
      },
      {
        onSuccess: () => {
          toast({
            variant: 'success',
            title: 'Success',
            description: 'FAQ updated successfully!',
          });
          reset();
          closeFlyout();
        },
        onError: (error: any) => {
          toast({
            variant: 'error',
            title: 'Error',
            description: error.message || 'Failed to update FAQ',
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
            className="bg-white"
            onCloseClick={closeFlyout}
          >
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <Lock size={20} strokeWidth={1.5} />
                <Text variant="lg-semibold" className="ml-2">
                  Edit FAQ
                </Text>
              </SheetTitle>
              <hr className="mb-6 border-t border-gray-300" />
            </SheetHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <Input
                placeholder="Enter question"
                {...register('question', {
                  required: 'Question is required',
                })}
                errorMessage={errors?.question?.message}
              />
              <Textarea
                placeholder="Enter answer"
                {...register('answer', {
                  required: 'Answer is required',
                })}
                errorMessage={errors?.answer?.message}
              />
              <div className="flex justify-end gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={closeFlyout}
                  disabled={updateFAQ.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateFAQ.isPending}>
                  {updateFAQ.isPending ? 'Updating...' : 'Update FAQ'}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </section>
    </ToastProvider>
  );
};

export default EditCourseFAQFlyOut;
