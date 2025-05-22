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
import { useState } from 'react';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'ui';

import { SortableItem } from './SortableChapterItem';

export const SortableChapter = ({
  id,
  title,
  expanded,
  chapterItems,
  toggleChapter,
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

  const [activeItemId, setActiveItemId] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      handleItemDragEnd(id, active.id, over.id);
    }
    setActiveItemId(null);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-2 ml-4">
      <Collapsible open={expanded}>
        <div className="group flex cursor-pointer items-center justify-between">
          <div className="flex items-center">
            <div
              {...attributes}
              {...listeners}
              className="mr-1 cursor-grab opacity-0 group-hover:opacity-100"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleChapter(id);
                }}
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <span className="text-sm font-medium">{title}</span>
          </div>
          <div className="hidden items-end justify-center group-hover:block">
            <div className="flex items-center gap-2">
              <span
                className="p-0 text-xs text-gray-500"
                onClick={async () => {
                  const params = new URLSearchParams(searchParams);
                  params.set('isAddCourseChapterFlyoutOpen', 'true');
                  params.set('chapterId', id);

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
          <div className="mt-1 space-y-1 pl-8">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={(e) => setActiveItemId(e.active.id)}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={chapterItems.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {chapterItems.map((item) => (
                  <SortableItem key={item.id} id={item.id} title={item.name} />
                ))}
              </SortableContext>

              <DragOverlay>
                {activeItemId ? (
                  <div className="rounded border bg-white p-1 text-xs shadow">
                    {
                      chapterItems.find((item) => item.id === activeItemId)
                        ?.title
                    }
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            <Button
              variant="ghost"
              size="sm"
              className="mt-1 flex items-center pl-1 text-xs text-blue-500"
              // onClick={() => addChapterItem(id)}
              onClick={async () => {
                const params = new URLSearchParams(searchParams);
                params.set('isAddChapterItemFlyoutOpen', 'true');
                params.set('chapterId', id);

                router.replace(pathname + '?' + params.toString());
              }}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add chapter item
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
