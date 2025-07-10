'use client';

import { PencilIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Switch } from 'ui';
import { cn } from 'utils';

import { LinkButton } from '@/components/LinkButton';
import { useQueryParams } from '@/hooks/useQueryParams';

type ExamCardProps = {
  examId: string;
  examName: string;
  termName: string;
  academicYear: string;
  isActive: boolean;
  className?: string;
  cardColor?: string;
  isClosed?: Boolean;
  setSelectedExam?: any;
  blockMarkEntry?: Boolean;
};

export function ExamCard({
  examId,
  examName,
  termName,
  academicYear,
  isActive,
  className,
  cardColor,
  isClosed,
  setSelectedExam,
}: ExamCardProps) {
  const { setParams } = useQueryParams();
  const { watch, setValue, register } = useForm({
    defaultValues: {
      isClosed,
      blockMarkEntry: false,
    },
  });
  useEffect(() => {
    setValue('isClosed', isClosed);
  }, [isClosed]);
  return (
    <div className={cn(`border-1 rounded-xl border p-4`, cardColor, className)}>
      <div className="flex justify-between">
        <h3 className="font-bold ">{examName}</h3>
        <p
          className={cn(
            'w-18 ml-2 h-5 rounded-lg border-none  px-2 text-center text-sm font-medium text-teal-800',
            isActive ? 'bg-teal-100' : 'bg-red-300'
          )}
        >
          {isActive ? 'Active' : 'Inactive'}
        </p>
        <Button
          variant="ghost"
          onClick={() =>
            setParams({ isSaveExamFlyoutOpen: 'true', examId: examId })
          }
        >
          <PencilIcon className="ml-2 h-4 w-4 text-primary-900" />
        </Button>
      </div>
      <div className="flex flex-wrap">
        <p className="py-3">
          <span className="rounded-lg bg-gray-200 p-1 text-sm font-semibold">
            {termName}
          </span>
          <span className="ml-2 rounded-lg bg-gray-200 p-1 text-sm font-semibold">
            {academicYear}
          </span>
        </p>
        <div className="flex gap-2">
          <LinkButton
            variant="primary"
            size="xs"
            url={`/exams/${examId}/config`}
            className="h-7"
          >
            Configure
          </LinkButton>
          <LinkButton
            variant="outline"
            size="xs"
            url={`/exams/mark-entry`}
            className="h-7"
          >
            Enter Mark
          </LinkButton>
          <div className="flex items-center">
            <Switch
              id="blockMarkEntry"
              checked={watch('blockMarkEntry')}
              {...register('blockMarkEntry')}
              onCheckedChange={(value) => {
                setValue('blockMarkEntry', value);
                setSelectedExam({ id: examId, name: examName });
              }}
            />
            <label
              htmlFor="blockMarkEntry"
              className="ml-2 text-sm font-semibold"
            >
              {watch('blockMarkEntry') ? 'Blocked' : 'Open'}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
