'use client';

import { useGetExamListQuery } from 'lib/queries/exams/useGetExamListQuery';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
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
  const [showBlockConfirmationModal, setShowBlockConfirmationModal] =
    useState(false);
  const [selectedExam, setSelectedExam] = useState<any>();

  const { data: examListResponse, isLoading: isExamListLoading } =
    useGetExamListQuery({ page, limit });

  const handleSelectedExam = (exam: any) => {
    setSelectedExam(exam);
    setShowBlockConfirmationModal(true);
  };

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
      <div className="container flex flex-wrap gap-4 ">
        {examListResponse?.data?.map((exam, index) => (
          <ExamCard
            key={exam?.id}
            examId={exam?.id}
            examName={exam?.name}
            termName={exam?.term?.name}
            academicYear={exam?.batch?.name}
            isActive={exam.isActive}
            isClosed={exam?.blockMarkEntry}
            className="lg:w-[32.2%] "
            cardColor={cardColors[index % cardColors.length]}
            setSelectedExam={handleSelectedExam}
          />
        ))}
      </div>
      <DeleteConfirmationModal
        open={showBlockConfirmationModal}
        description={`Are you sure you want to ${selectedExam?.id} "${selectedExam?.name}"`}
        onDeleteClick={async () => {
          if (selectedExam) {
            // await deleteBatchAsync(exam?.id);
            setShowBlockConfirmationModal(false);
          }
        }}
        onCancelClick={() => {
          setShowBlockConfirmationModal(false);
        }}
      />
    </div>
  );
}
