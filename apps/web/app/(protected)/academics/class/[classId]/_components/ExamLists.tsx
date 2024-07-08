'use client';

import { ExamCard } from 'app/(protected)/exams/_components/ExamCard';
import { useGetExamsByClassSectionQuery } from 'lib/queries/mark-entry/useGetExamsByClassSectionQuery';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const cardColors = [
  'bg-teal-50 border-teal-200',
  'bg-violet-50 border-violet-200',
  'bg-pink-50 border-pink-200',
  'bg-yellow-50 border-pink-200',
];

export function ExamLists() {
  const router = useRouter();
  const { classId } = useParams<{ classId: string }>();
  const {
    data: examListByClassIdResponse,
    isLoading: isLoadingExamListByClassId,
  } = useGetExamsByClassSectionQuery(
    { classId },
    {
      enabled: !!classId,
    }
  );

  if (isLoadingExamListByClassId) {
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
        {examListByClassIdResponse?.map((exam, index) => (
          <div
            key={exam.id}
            onClick={() => {
              router.push(`/academics/exams/${exam.id}`);
            }}
          >
            <ExamCard
              examName={exam.name}
              termName={exam.term.name}
              academicYear={exam.batch.name}
              isActive={exam.isActive}
              className="border border-lime-200 bg-lime-50"
              examId={exam.id}
              cardColor={cardColors[index % cardColors.length]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
