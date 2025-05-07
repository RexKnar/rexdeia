'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileText, GripVertical, Trash } from 'lucide-react';

import { useQueryParams } from '@/hooks/useQueryParams';

export const SortableItem = ({ id, title }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const { setParams } = useQueryParams();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const loadChapterItem = () => {
    setParams({
      chapterItemId: id,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex cursor-pointer justify-between py-1"
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="mr-1 cursor-grab opacity-0 group-hover:opacity-100"
        >
          <GripVertical className="h-3 w-3 text-gray-700" />
        </div>
        <FileText className="mr-2 h-4 w-4 text-gray-700" />
        <span className="text-xs" onClick={() => loadChapterItem()}>
          {title}
        </span>
      </div>
      <div className="hidden items-end justify-center group-hover:block">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            <Trash className="mr-1 h-4 w-4 text-red-500" />
          </span>
        </div>
      </div>
    </div>
  );
};
