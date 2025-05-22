'use client';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronDown,
  ChevronRight,
  Edit,
  GripVertical,
  Plus,
  Trash,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'ui';

import { SortableChapter } from './SortableChapter';

export const SortableModule = ({
  id,
  title,
  chapters,
  expanded,
  toggleModule,
  toggleChapter,
  handleChapterDragEnd,
  handleItemDragEnd,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeChapterId, setActiveChapterId] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      handleChapterDragEnd(id, active.id, over.id);
    }
    setActiveChapterId(null);
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Collapsible open={expanded}>
        <div className="group mb-1 flex items-center justify-between bg-gray-100 px-2 py-1 font-semibold">
          <div className="flex items-center">
            <div
              {...attributes}
              {...listeners}
              className="mr-2 cursor-grab opacity-0 group-hover:opacity-100"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModule(id);
                }}
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <span className="ml-1">{title}</span>
          </div>
          <div className="hidden items-end justify-center group-hover:block">
            <div className="flex items-center gap-2">
              <span
                className="p-0 text-xs text-gray-500"
                onClick={async () => {
                  const params = new URLSearchParams(searchParams);
                  params.set('isAddCourseModuleFlyoutOpen', 'true');
                  params.set('moduleId', id);

                  router.replace(pathname + '?' + params.toString());
                }}
              >
                <Edit className="mr-1 h-4 w-4 text-primary-700" />
              </span>
              <span className="p-0 text-xs text-gray-500">
                <Trash className="mr-1 h-4 w-4 text-red-500" />
              </span>
            </div>
          </div>
        </div>

        <CollapsibleContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(e) => setActiveChapterId(e.active.id)}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={chapters.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {chapters.map((chapter) => (
                <SortableChapter
                  key={chapter.id}
                  {...chapter}
                  title={chapter?.name}
                  toggleChapter={toggleChapter}
                  handleItemDragEnd={(chapterId, aId, oId) =>
                    handleItemDragEnd(id, chapterId, aId, oId)
                  }
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeChapterId ? (
                <div className="rounded border bg-white p-2 shadow">
                  {chapters.find((c) => c.id === activeChapterId)?.title}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <Button
            variant="ghost"
            size="sm"
            className="ml-6 mt-1 flex items-center text-xs text-blue-500"
            // onClick={() => addChapter(id)}
            onClick={async () => {
              const params = new URLSearchParams(searchParams);
              params.set('isAddCourseChapterFlyoutOpen', 'true');
              params.set('moduleId', id);

              router.replace(pathname + '?' + params.toString());
            }}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add chapter
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
