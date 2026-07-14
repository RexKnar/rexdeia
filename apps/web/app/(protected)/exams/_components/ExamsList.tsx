'use client';

import { useToggleExamBlockMutationQuery } from 'lib/queries/exams/block/useUpdateExamBlockMutationQuery';
import { useGetExamListQuery } from 'lib/queries/exams/useGetExamListQuery';
import { useDeleteExamMutationQuery } from 'lib/queries/exams/useDeleteExamMutationQuery';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'ui';

import { BlockConfirmationModal } from '@/components/modals/BlockConfirmationModal';
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

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedExamForDelete, setSelectedExamForDelete] = useState<any>();

  const { mutateAsync: toggleExamBlock } = useToggleExamBlockMutationQuery();
  const { mutateAsync: deleteExam } = useDeleteExamMutationQuery(page, limit);

  const { data: examListResponse, isLoading: isExamListLoading } =
    useGetExamListQuery({ page, limit });

  const handleSelectedExam = (exam: any) => {
    setSelectedExam(exam);
    setShowBlockConfirmationModal(true);
  };

  const handleBlockToggle = async () => {
    if (!selectedExam) return;

    try {
      await toggleExamBlock({
        examId: selectedExam.id,
        blockMarkEntry: !selectedExam.blockMarkEntry,
      });
    } catch (err) {
      console.error('Failed to toggle mark entry block:', err);
    } finally {
      setShowBlockConfirmationModal(false);
    }
  };

  const handleDeleteClick = (exam: any) => {
    setSelectedExamForDelete(exam);
    setShowDeleteConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedExamForDelete) return;

    try {
      await deleteExam(selectedExamForDelete.id);
      toast({
        title: 'Exam Deleted',
        description: `Successfully deleted exam "${selectedExamForDelete.name}".`,
        variant: 'default',
      });
    } catch (err: any) {
      console.error('Failed to delete exam:', err);
      toast({
        title: 'Delete Failed',
        description: err.message || 'Could not delete exam.',
        variant: 'default',
      });
    } finally {
      setShowDeleteConfirmationModal(false);
    }
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
            blockMarkEntry={exam.blockMarkEntry}
            hasMarks={exam.hasMarks}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </div>
      <BlockConfirmationModal
        open={showBlockConfirmationModal}
        isBlockAction={selectedExam?.blockMarkEntry === false}
        title={`Are you sure you want to ${selectedExam?.blockMarkEntry === false ? 'block' : 'unblock'} "${selectedExam?.name}"?`}
        description={`This will ${selectedExam?.blockMarkEntry === false ? 'disable' : 'enable'} mark entry.`}
        onConfirmClick={handleBlockToggle}
        onCancelClick={() => setShowBlockConfirmationModal(false)}
      />
      <DeleteConfirmationModal
        open={showDeleteConfirmationModal}
        title={`Are you sure you want to delete "${selectedExamForDelete?.name}"?`}
        description="This will permanently delete the exam configuration. This action cannot be undone."
        onDeleteClick={handleConfirmDelete}
        onCancelClick={() => setShowDeleteConfirmationModal(false)}
      />
    </div>
  );
}
