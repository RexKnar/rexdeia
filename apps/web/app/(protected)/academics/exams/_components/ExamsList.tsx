'use client';

import { useGetExamListQuery } from 'lib/queries/exams/useGetExamListQuery';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useQueryParams } from '@/hooks/useQueryParams';

import { ExamCard } from './ExamCard';

export function ExamsList() {
  const { getParam } = useQueryParams();
  const router = useRouter();
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
    <div className="container p-4">
      <h2 className="mb-4 text-sm font-semibold text-gray-600">Exams</h2>

      <div className="grid grid-cols-6 gap-2 ">
        {examListResponse?.data?.map((exam) => (
          <div
            key={exam.id}
            onClick={() => {
              router.push(`/academics/exams/${exam.id}/configuration/add`);
            }}
          >
            <ExamCard
              examName={exam.name}
              termName={exam.term.name}
              academicYear={exam.batch.name}
              className="border border-lime-200 bg-lime-50"
            />
          </div>
        ))}
      </div>

      {/* <h2 className="mt-4 mb-4 text-sm font-semibold text-gray-600">
        Scheduled
      </h2>
      <div className="grid grid-cols-6 gap-2 ">
        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="mb-4 border border-amber-200 bg-yellow-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="mb-4 ml-2 border border-lime-200 bg-lime-50"
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="mb-4 ml-2 border border-purple-200 bg-purple-50 "
        />
        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="mb-4 ml-2 border border-amber-200 bg-amber-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="mb-4 ml-2 border border-blue-200 bg-slate-50"
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="mb-4 ml-2 border border-red-200 bg-red-50 "
        />
        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="border border-green-200 bg-green-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-violet-200 bg-slate-100 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-pink-200 bg-pink-50 "
        />
      </div>
      <h2 className="mt-4 mb-4 ml-2 text-sm font-semibold text-gray-600">
        Completed
      </h2>
      <div className="grid grid-cols-6 gap-2 ">
        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="border border-purple-200 bg-purple-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-lime-200 bg-lime-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-amber-200 bg-amber-50 "
        />
        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-amber-200 bg-yellow-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-red-200 bg-red-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-blue-200 bg-slate-50 "
        />
      </div> */}
    </div>
  );
}
