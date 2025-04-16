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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Image,
  Plus,
} from 'lucide-react';
import React, { useState } from 'react';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'ui';

const SortableItem = ({ id, title }) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center py-1"
    >
      <div
        {...attributes}
        {...listeners}
        className="mr-1 cursor-grab opacity-0 group-hover:opacity-100"
      >
        <GripVertical className="h-3 w-3 text-gray-400" />
      </div>
      <FileText className="mr-2 h-4 w-4 text-gray-400" />
      <span className="text-xs">{title}</span>
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
      >
        <FileText className="h-3 w-3 text-gray-400" />
      </Button>
    </div>
  );
};

const SortableChapter = ({
  id,
  title,
  expanded,
  items,
  toggleChapter,
  addChapterItem,
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeItemId, setActiveItemId] = useState(null);

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
    <div ref={setNodeRef} style={style} className="mb-2">
      <Collapsible open={expanded}>
        <div className="group flex items-center">
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
          <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
            <FileText className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        <CollapsibleContent>
          <div className="mt-1 space-y-1 pl-8">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={(event) => setActiveItemId(event.active.id)}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => (
                  <SortableItem key={item.id} id={item.id} title={item.title} />
                ))}
              </SortableContext>

              <DragOverlay>
                {activeItemId ? (
                  <div className="rounded border bg-white p-1 text-xs shadow">
                    {items.find((item) => item.id === activeItemId)?.title}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            <Button
              variant="ghost"
              size="sm"
              className="mt-1 flex items-center pl-1 text-xs text-blue-500"
              onClick={() => addChapterItem(id)}
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

const CourseBuilder = () => {
  const [chapters, setChapters] = useState([
    {
      id: 'chapter-1',
      title: 'Introduction to React',
      expanded: true,
      items: [],
    },
    {
      id: 'chapter-2',
      title: 'Working with React Components',
      expanded: true,
      items: [
        { id: 'item-1', title: 'Creating functional components' },
        { id: 'item-2', title: 'Creating class components' },
        { id: 'item-3', title: 'Using props to pass data' },
        { id: 'item-4', title: 'Handling events in React' },
        { id: 'item-5', title: 'Conditional rendering in React' },
        { id: 'item-6', title: 'Lists and keys in React' },
        { id: 'item-7', title: 'React component composition' },
        { id: 'item-8', title: 'Styling React components' },
        { id: 'item-9', title: 'Forms and form handling in React' },
        { id: 'item-10', title: 'Basic react' },
      ],
    },
    {
      id: 'chapter-3',
      title: 'Managing State in React',
      expanded: false,
      items: [{ id: 'item-11', title: 'Understanding state in React' }],
    },
  ]);

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleChapter = (chapterId) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, expanded: !chapter.expanded }
          : chapter
      )
    );
  };

  const addChapter = () => {
    const newChapterId = `chapter-${Date.now()}`;
    const newChapter = {
      id: newChapterId,
      title: 'New Chapter',
      expanded: true,
      items: [],
    };

    setChapters([...chapters, newChapter]);
  };

  const addChapterItem = (chapterId) => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.id === chapterId) {
          const newItemId = `item-${Date.now()}`;
          return {
            ...chapter,
            items: [...chapter.items, { id: newItemId, title: 'New item' }],
          };
        }
        return chapter;
      })
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setChapters((chapters) => {
        const oldIndex = chapters.findIndex(
          (chapter) => chapter.id === active.id
        );
        const newIndex = chapters.findIndex(
          (chapter) => chapter.id === over.id
        );

        return arrayMove(chapters, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const handleItemDragEnd = (chapterId, activeItemId, overItemId) => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.id === chapterId) {
          const items = [...chapter.items];
          const oldIndex = items.findIndex((item) => item.id === activeItemId);
          const newIndex = items.findIndex((item) => item.id === overItemId);

          return {
            ...chapter,
            items: arrayMove(items, oldIndex, newIndex),
          };
        }
        return chapter;
      })
    );
  };

  return (
    <section className="relative flex w-full gap-2">
      <div className="h-screen w-[30%] overflow-y-auto border-r border-gray-200 bg-white">
        <div className="border-b p-4">
          <div className="flex items-center justify-center rounded-md bg-gray-100 p-8">
            <Button variant="outline" className="w-full text-sm">
              <Image className="mr-2 h-4 w-4" />
              Add course cover
            </Button>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              Set user preview
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              Set rules
            </Button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => setActiveId(event.active.id)}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapters.map((chapter) => chapter.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="p-2">
              {chapters.map((chapter) => (
                <SortableChapter
                  key={chapter.id}
                  id={chapter.id}
                  title={chapter.title}
                  expanded={chapter.expanded}
                  items={chapter.items}
                  toggleChapter={toggleChapter}
                  addChapterItem={addChapterItem}
                  handleItemDragEnd={handleItemDragEnd}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <div className="rounded border bg-white p-2 shadow">
                {chapters.find((c) => c.id === activeId)?.title}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex w-full items-center justify-center text-sm text-blue-500"
            onClick={addChapter}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add chapter
          </Button>
        </div>
      </div>
      <div className="w-[70%]">
        <h1>Content Area</h1>
      </div>
    </section>
  );
};

export default CourseBuilder;
