'use client';
import { useCreateExamPartitionMutationQuery } from 'lib/queries/exams/configuration/subject/useCreateExamPartitionMutationQuery';
import { PlusCircle } from 'lucide-react';
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
  useToast,
} from 'ui';

export type EnablePartitionTarget = {
  examSubjectId: string;
  assessmentFormatId: string;
  assessmentFormatName: string;
  subjectName: string;
  sectionName?: string;
  defaultOrder: number;
};

type EnableExamPartitionFlyoutProps = {
  open: boolean;
  onClose: () => void;
  examId: string;
  sectionIds: string[];
  subjectId: string;
  target: EnablePartitionTarget | null;
};

type EnablePartitionFormValues = {
  excludeSubjectValidation: boolean;
  order: string | number;
  dateToConduct: string;
  totalMarks: string;
  convertTo: string;
  minMark: string;
};

export function EnableExamPartitionFlyout({
  open,
  onClose,
  examId,
  sectionIds,
  subjectId,
  target,
}: EnableExamPartitionFlyoutProps) {
  const { toast } = useToast();
  const {
    reset,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: fieldErrors },
  } = useForm<EnablePartitionFormValues>({
    defaultValues: {
      excludeSubjectValidation: false,
      order: target?.defaultOrder ?? 1,
      dateToConduct: '',
      totalMarks: '',
      convertTo: '',
      minMark: '',
    },
  });

  useEffect(() => {
    if (open && target) {
      reset({
        excludeSubjectValidation: false,
        order: target.defaultOrder ?? 1,
        dateToConduct: '',
        totalMarks: '',
        convertTo: '',
        minMark: '',
      });
    }
  }, [open, target, reset]);

  const {
    mutateAsync: createExamPartitionAsync,
    isPending: isCreatingPartition,
  } = useCreateExamPartitionMutationQuery(examId, sectionIds, subjectId);

  const handleClose = () => {
    reset();
    onClose();
  };

  async function onSubmit(values: EnablePartitionFormValues) {
    if (!target) return;

    try {
      await createExamPartitionAsync({
        examSubjectId: target.examSubjectId,
        assessmentFormatId: target.assessmentFormatId,
        totalMarks: values.totalMarks,
        convertTo: values.convertTo,
        minMark: values.minMark,
        dateToConduct: values.dateToConduct,
        order: values.order,
        excludeSubjectValidation: Boolean(values.excludeSubjectValidation),
      });

      toast({
        title: 'Success',
        variant: 'default',
        description: `Partition "${target.assessmentFormatName}" enabled successfully`,
      });
      handleClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error?.message || 'Error while enabling partition',
      });
    }
  }

  return (
    <section>
      <Sheet
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleClose();
          }
        }}
      >
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={handleClose}
        >
          <div className="max-h-[95vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        Enable {target?.assessmentFormatName} for{' '}
                        {target?.subjectName}
                        {target?.sectionName ? ` (${target.sectionName})` : ''}
                      </Text>
                    </div>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300" />
              </SheetHeader>

              <div className="mt-5 p-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="enableExcludeSubjectValidation"
                    className="text-sm font-semibold"
                  >
                    Exclude in Pass Criteria
                  </label>
                  <Switch
                    id="enableExcludeSubjectValidation"
                    onCheckedChange={(value) =>
                      setValue('excludeSubjectValidation', value)
                    }
                    checked={Boolean(watch('excludeSubjectValidation'))}
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="enablePartitionOrder"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Order
                  </label>
                  <Input
                    id="enablePartitionOrder"
                    type="number"
                    min={1}
                    step={1}
                    {...register('order', {
                      required: 'Order is required',
                      validate: (val) => {
                        const trimmed = String(val ?? '').trim();
                        if (!trimmed) return 'Order is required';
                        const num = Number(trimmed);
                        if (!Number.isInteger(num) || num < 1) {
                          return 'Order must be a whole number of at least 1';
                        }
                        return true;
                      },
                    })}
                    errorMessage={fieldErrors?.order?.message?.toString()}
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="enablePartitionDate"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Date to Conduct
                  </label>
                  <Input
                    id="enablePartitionDate"
                    type="date"
                    {...register('dateToConduct', {
                      required: 'Date to conduct is required',
                    })}
                    errorMessage={fieldErrors?.dateToConduct?.message?.toString()}
                  />
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="enablePartitionTotalMarks"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Marks to conduct
                  </label>
                  <Input
                    {...register('totalMarks', {
                      required: 'Marks to conduct is required',
                      validate: (val) => {
                        const trimmed = String(val ?? '').trim();
                        if (!trimmed) return 'Marks to conduct is required';
                        const num = Number(trimmed);
                        if (!Number.isFinite(num) || num < 0) {
                          return 'Must be a valid non-negative number';
                        }
                        return true;
                      },
                    })}
                    id="enablePartitionTotalMarks"
                    autoFocus
                    type="text"
                    className="mt-2"
                    placeholder="Marks to conduct"
                    errorMessage={fieldErrors?.totalMarks?.message?.toString()}
                  />
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="enablePartitionConvertTo"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Mark to Convert
                  </label>
                  <Input
                    {...register('convertTo', {
                      required: 'Mark to convert is required',
                      validate: (val) => {
                        const trimmed = String(val ?? '').trim();
                        if (!trimmed) return 'Mark to convert is required';
                        const num = Number(trimmed);
                        if (!Number.isFinite(num) || num < 0) {
                          return 'Must be a valid non-negative number';
                        }
                        return true;
                      },
                    })}
                    id="enablePartitionConvertTo"
                    type="text"
                    className="mt-2"
                    placeholder="Mark to Convert"
                    errorMessage={fieldErrors?.convertTo?.message?.toString()}
                  />
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="enablePartitionMinMark"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Min Pass Mark
                  </label>
                  <Input
                    {...register('minMark', {
                      required: 'Min pass mark is required',
                      validate: (val) => {
                        const trimmed = String(val ?? '').trim();
                        if (!trimmed) return 'Min pass mark is required';
                        const num = Number(trimmed);
                        if (!Number.isFinite(num) || num < 0) {
                          return 'Must be a valid non-negative number';
                        }
                        const totalStr = String(
                          watch('totalMarks') ?? ''
                        ).trim();
                        if (totalStr !== '') {
                          const totalNum = Number(totalStr);
                          if (Number.isFinite(totalNum) && num > totalNum) {
                            return 'Min pass mark cannot exceed marks to conduct';
                          }
                        }
                        return true;
                      },
                    })}
                    id="enablePartitionMinMark"
                    type="text"
                    className="mt-2"
                    placeholder="Min Pass Mark"
                    errorMessage={fieldErrors?.minMark?.message?.toString()}
                  />
                </div>
                <div className="mt-1 flex justify-end">
                  <label className="text-sm font-medium text-gray-600">
                    From conducting mark
                  </label>
                </div>
              </div>

              <div className="mt-10">
                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  disabled={isCreatingPartition}
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  {isCreatingPartition ? 'Saving...' : 'Save & Close'}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
