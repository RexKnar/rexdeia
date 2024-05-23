'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from 'ui';
import { cn } from 'utils';

type ExamCardProps = {
  examId: string;
  examName: string;
  termName: string;
  academicYear: string;
  isActive: boolean;
  className?: string;
  cardColor?: string;
};

export function ExamCard({
  examId,
  examName,
  termName,
  academicYear,
  isActive,
  className,
  cardColor,
}: ExamCardProps) {
  const router = useRouter();
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
          <Button
            size="xs"
            className="text-xs text-white"
            onClick={() => {
              router.push(`/academics/exams/${examId}/configuration/add`);
            }}
          >
            Configure
          </Button>
          <Button
            variant="outline"
            size="xs"
            className="text-xs"
            onClick={() => {
              router.push(`/academics/exams/mark-entry/`);
            }}
          >
            Enter Mark
          </Button>
        </div>
      </div>
    </div>
  );
}
