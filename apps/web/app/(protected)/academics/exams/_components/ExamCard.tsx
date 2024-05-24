'use client';

import React from 'react';
import { cn } from 'utils';

import { LinkButton } from '@/components/LinkButton';

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
          <LinkButton
            variant="primary"
            size="xs"
            url={`/exams/${examId}/config`}
            className="h-7"
          >
            Configure
          </LinkButton>
          <LinkButton variant="outline" size="xs" url={`/exams/mark-entry`}>
            Enter Mark
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
