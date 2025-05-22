'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDeleteCourseFAQMutationQuery } from 'lib/queries/institute/course/faq/useDeleteCourseFAQMutationQuery';
import { ChevronDown, Edit, GripVertical, Trash } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Collapsible, CollapsibleContent } from 'ui';

import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

import EditCourseFAQFlyOut from '../_modals/EditCourseFAQFlyout';

export default function SortableFAQItem({
  faq,
  openId,
  setOpenId,
  instituteCourseId,
}: any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: faq.id });

  const deleteFAQ = useDeleteCourseFAQMutationQuery(instituteCourseId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

  const isOpen = openId === faq.id;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-col rounded-md bg-gray-100 px-4 py-2 shadow-sm"
      >
        <Collapsible
          open={isOpen}
          onOpenChange={() => setOpenId(isOpen ? null : faq.id)}
        >
          <div className="flex items-center justify-between">
            <div {...attributes} {...listeners} className="cursor-grab pr-2">
              <GripVertical className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex w-full justify-between">
              <button
                className="flex w-full items-center justify-between text-left"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
              >
                <span className="text-left text-sm font-medium text-gray-800">
                  {faq.question}
                </span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('isUpdateCourseFAQFlyoutOpen', 'true');
                    params.set('editFAQId', faq.id);
                    router.replace(pathname + '?' + params.toString());
                  }}
                  className="text-left"
                >
                  <Edit className="h-4 w-4 text-primary-700" />
                </button>

                <button
                  className="text-left"
                  onClick={() => setShowDeleteConfirmationModal(true)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </button>

                <button
                  className="text-left"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                >
                  <ChevronDown
                    className={`ml-2 h-4 w-4 text-black transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <CollapsibleContent className="mt-2 pl-8 text-sm text-gray-800">
            {faq.answer}
          </CollapsibleContent>
        </Collapsible>

        <EditCourseFAQFlyOut
          courseId={instituteCourseId}
          initialData={{
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            instituteCourseId,
          }}
        />
      </div>
      <DeleteConfirmationModal
        open={showDeleteConfirmationModal}
        description={`Are you sure you want to delete this Question ?`}
        onDeleteClick={async () => {
          setShowDeleteConfirmationModal(false);
          await deleteFAQ.mutateAsync(faq.id);
        }}
        onCancelClick={() => setShowDeleteConfirmationModal(false)}
      />
    </>
  );
}
