import React from 'react';

type ExamCardProps = {
  examName: string;
  termName: string;
  academicYear: string;
  className?: string;
};

export function ExamCard({
  examName,
  termName,
  academicYear,
  className,
}: ExamCardProps) {
  const cardClasses = `h-24 rounded-xl p-2 ${className}  border-1`;

  return (
    <div className={cardClasses}>
      <div className="mx-2 my-4">
        <h3 className="mb-2 text-sm font-bold">{examName}</h3>
        <div className="flex flex-wrap">
          <p className="rounded-lg bg-gray-200 p-1 text-[8px] font-semibold">
            {termName}
          </p>
          <p className="ml-2 rounded-lg bg-gray-200 p-1 text-[8px] font-semibold">
            {academicYear}
          </p>
        </div>
      </div>
    </div>
  );
}
