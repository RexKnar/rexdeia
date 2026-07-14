'use client';

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Text,
  toast,
} from 'ui';
import { Copy, Loader2 } from 'lucide-react';
import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { useGetExamListQuery } from 'lib/queries/exams/useGetExamListQuery';
import { GET_EXAM_LIST } from 'lib/endpoints';

export function CopyExamModal() {
  const [open, setOpen] = useState(false);
  const [newExamName, setNewExamName] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  // 1. Fetch academic years list (limit 100 to get all)
  const { batches, isLoading: isBatchesLoading } = useGetBatchesListQuery({
    page: 1,
    limit: 100,
    filter: {},
  });

  // 2. Fetch exams list filtered by selected academic year batchId
  const { data: examsResponse, isLoading: isExamsLoading } = useGetExamListQuery(
    {
      page: 1,
      limit: 100,
      batchId: selectedBatchId || undefined,
    },
    {
      enabled: !!selectedBatchId,
    }
  );
  const examsList = examsResponse?.data || [];

  const handleCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId || !selectedBatchId) {
      toast({
        title: 'Validation Error',
        description: 'Please select both the source academic year and the exam to copy.',
        variant: 'default',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/exam/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examId: selectedExamId,
          academicYearId: selectedBatchId,
          name: newExamName.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to copy exam.');
      }

      const result = await response.json();

      if (result && result.success) {
        toast({
          title: 'Exam Copied',
          description: `Exam successfully copied and linked to matching classes and subjects.`,
          variant: 'default',
        });
        setOpen(false);
        resetState();
        // Invalidate main exam queries to refresh list
        await queryClient.refetchQueries({
          queryKey: [GET_EXAM_LIST],
        });
      } else {
        toast({
          title: 'Copy Failed',
          description: result.error || 'Failed to copy exam. Make sure matching classes exist in the current academic year.',
          variant: 'default',
        });
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Error',
        description: err.message || 'An unexpected error occurred.',
        variant: 'default',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setNewExamName('');
    setSelectedBatchId('');
    setSelectedExamId('');
  };

  const handleOnOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetState();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOnOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10">
          <Copy size={16} />
          Copy Exam
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-white p-10 sm:max-w-md"
      >
        <form onSubmit={handleCopy}>
          <SheetHeader>
            <SheetTitle className="mb-5">
              <div className="flex items-center">
                <Copy size={20} strokeWidth={1.5} className="text-gray-700" />
                <Text variant="lg-semibold" className="ml-2 text-gray-800">
                  Copy Exam
                </Text>
              </div>
            </SheetTitle>
            <hr className="border-t border-gray-300" />
          </SheetHeader>

          <div className="mt-5 space-y-4">
            {/* Custom Name */}
            <div>
              <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                New Exam Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter new exam name (optional)"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                className="mt-2"
                disabled={isSubmitting}
              />
            </div>

            {/* Academic Year Selection */}
            <div>
              <label htmlFor="academicYear" className="text-sm font-semibold text-gray-700">
                Source Academic Year
              </label>
              <Select
                value={selectedBatchId}
                onValueChange={(val) => {
                  setSelectedBatchId(val);
                  setSelectedExamId('');
                }}
                disabled={isSubmitting || isBatchesLoading}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder={isBatchesLoading ? "Loading years..." : "Select Academic Year"} />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-800">
                  <SelectGroup>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id} className="hover:bg-gray-50">
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Exam Selection */}
            <div>
              <label htmlFor="examToCopy" className="text-sm font-semibold text-gray-700">
                Exam to Copy
              </label>
              <Select
                value={selectedExamId}
                onValueChange={setSelectedExamId}
                disabled={isSubmitting || !selectedBatchId || isExamsLoading}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder={isExamsLoading ? "Loading exams..." : !selectedBatchId ? "Select academic year first" : "Select Exam"} />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-800">
                  <SelectGroup>
                    {examsList.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id} className="hover:bg-gray-50">
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Action Button */}
            <div className="mt-10 pt-4 flex justify-center">
              <Button
                size="lg"
                variant="default"
                disabled={isSubmitting || !selectedExamId}
                className="px-12 py-4"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                    Copying
                  </div>
                ) : (
                  'Copy'
                )}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
