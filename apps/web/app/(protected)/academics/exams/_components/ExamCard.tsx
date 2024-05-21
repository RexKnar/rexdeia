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
  className?: string;
};

export function ExamCard({
  examId,
  examName,
  termName,
  academicYear,
  className,
}: ExamCardProps) {
  const router = useRouter();
  return (
    <div
      className={cn(
        ` border-1 rounded-xl border border-lime-200 bg-lime-50 p-4`,
        className
      )}
    >
      <h3 className="font-bold ">{examName}</h3>
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
            className="text-white"
            onClick={() => {
              router.push(`/academics/exams/${examId}/configuration/add`);
            }}
          >
            Configure
          </Button>
          <Button
            variant="outline"
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
