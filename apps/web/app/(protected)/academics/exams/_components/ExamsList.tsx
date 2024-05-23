'use client';

import { useGetExamListQuery } from 'lib/queries/exams/useGetExamListQuery';
import { Loader2 } from 'lucide-react';

import { useQueryParams } from '@/hooks/useQueryParams';

import { ExamCard } from './ExamCard';

const cardColors = [
  'bg-teal-50 border-teal-200',
  'bg-violet-50 border-violet-200',
  'bg-pink-50 border-pink-200',
  'bg-yellow-50 border-pink-200',
];

export function ExamsList() {
  const { getParam } = useQueryParams();

  const page = parseInt(getParam('page')) || 1;
  const limit = parseInt(getParam('limit')) || 999;

  const { data: examListResponse, isLoading: isExamListLoading } =
    useGetExamListQuery({ page, limit });

  if (isExamListLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black ">Fetching exam Details...</p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-gray-600">Exams</h2>
      <div className="container flex flex-wrap gap-5 p-4">
        {examListResponse?.data?.map((exam, index) => (
          <ExamCard
            key={exam.id}
            examId={exam.id}
            examName={exam.name}
            termName={exam.term.name}
            academicYear={exam.batch.name}
            className="w-3/12"
            cardColor={cardColors[index % cardColors.length]}
          />
        ))}
      </div>
    </div>
  );
}
