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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { InstituteCourseModuleModel } from 'lib/domain/institute/module';
import { useGetCourseContentStructureQuery } from 'lib/queries/institute/course/contentStructure/useGetCourseContentStructureQuery';
import { useGetInstituteCourseDetailByIdQuery } from 'lib/queries/institute/course/useGetInstituteCourseDetailByIdQuery';
import { useUpdateCourseMutationQuery } from 'lib/queries/institute/course/useUpdateCourseMutationQuery';
import { Camera, Plus } from 'lucide-react';
import Image from 'next/image';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button, useToast } from 'ui';

import { LinkButton } from '@/components/LinkButton';
import { useQueryParams } from '@/hooks/useQueryParams';

import { AddChapterItemFlyout } from '../_modals/AddChapterItemFlyout';
import { AddCourseChapterFlyout } from '../_modals/AddCourseChapterFlyout';
import { AddCourseModuleFlyout } from '../_modals/AddCourseModuleFlyout';
import ChapterItemContentArea from './ChapterItemContentArea';
import { SortableModule } from './SortableModule';

export default function CourseBuilder() {
  const [modules, setModules] = useState<InstituteCourseModuleModel[]>([]);
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams<{ courseId: string; chapterItemId: string }>();
  const { setParams } = useQueryParams();

  const courseId = searchParams.get('courseId') || routeParams.courseId;
  const chapterItemId = searchParams.get('chapterItemId');
  const { data: courseDetail, isLoading: isCourseDetailLoading } =
    useGetInstituteCourseDetailByIdQuery(courseId);
  const { data: courseStructure } = useGetCourseContentStructureQuery(
    courseId,
    {
      enabled: !!courseId,
    }
  );
  const { mutateAsync: updateCourseMutationQuery } =
    useUpdateCourseMutationQuery(courseId);

  const [activeModuleId, setActiveModuleId] = useState(null);
  useEffect(() => {
    if (courseStructure) {
      setModules(courseStructure);
      const tempModules = courseStructure[0];
      const tempChapters = tempModules.chapters[0];
      const tempChapterItems = tempChapters.chapterItems[0];
      setParams({
        chapterItemId: tempChapterItems?.id || '',
      });
    }
  }, [courseStructure]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleModule = (moduleId) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId ? { ...mod, expanded: !mod.expanded } : mod
      )
    );
  };
  const toggleChapter = (chapterId) => {
    setModules((mods) =>
      mods.map((mod) => ({
        ...mod,
        chapters: mod.chapters.map((chap) =>
          chap.id === chapterId ? { ...chap, expanded: !chap.expanded } : chap
        ),
      }))
    );
  };

  const handleModuleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = modules.findIndex((m) => m.id === active.id);
    const newIndex = modules.findIndex((m) => m.id === over.id);
    setModules(arrayMove(modules, oldIndex, newIndex));
    setActiveModuleId(null);
  };

  const handleChapterDragEnd = (moduleId, activeId, overId) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId
          ? {
              ...mod,
              chapters: arrayMove(
                mod.chapters,
                mod.chapters.findIndex((c) => c.id === activeId),
                mod.chapters.findIndex((c) => c.id === overId)
              ),
            }
          : mod
      )
    );
  };

  const handleItemDragEnd = (moduleId, chapterId, activeId, overId) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId
          ? {
              ...mod,
              chapters: mod.chapters.map((chap) =>
                chap.id === chapterId
                  ? {
                      ...chap,
                      items: arrayMove(
                        chap.chapterItems,
                        chap.chapterItems.findIndex((i) => i.id === activeId),
                        chap.chapterItems.findIndex((i) => i.id === overId)
                      ),
                    }
                  : chap
              ),
            }
          : mod
      )
    );
  };
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Invalid file',
        description: 'Only images under 5MB are allowed.',
      });
      return;
    }

    try {
      const url = new URL(`${window.location.origin}/api/upload`);
      const formData = new FormData();
      formData.append('file', file);

      const imageResponse = await fetch(url.toString(), {
        method: 'POST',
        body: formData,
      });

      if (!imageResponse.ok) throw new Error('Upload failed');

      const { data } = await imageResponse.json();
      const key = data?.filePath;

      if (!key) {
        toast({
          title: 'Failed!',
          variant: 'destructive',
          description: 'No file key returned.',
        });
        return;
      }
      const payload = {
        ...courseDetail,
        coverImage: key,
      };

      const response = await updateCourseMutationQuery(payload);
      if (response) {
        toast({ title: 'Success', description: 'Cover image updated.' });
      } else {
        toast({
          title: 'Update failed',
          variant: 'destructive',
          description: 'Could not save image reference.',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'An error occurred during upload.',
      });
    }
  };

  return (
    <>
      <section className="relative flex w-full gap-2">
        <div className="h-screen w-[30%] overflow-y-auto border-r border-gray-200 bg-white">
          <div className="border-b p-4">
            <div className="relative flex items-center justify-center rounded-md bg-gray-100 p-8">
              <label className="absolute right-2 top-2 z-50 cursor-pointer rounded-full bg-white p-2 shadow-lg transition-colors hover:bg-gray-100">
                <Camera className="h-5 w-5" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              <div className="relative">
                {!isCourseDetailLoading ? (
                  <span>
                    {courseDetail?.coverImage ? (
                      <div className="relative h-64 w-full overflow-hidden rounded-md">
                        <Image
                          src={courseDetail.coverImage}
                          alt={courseDetail.coverImage[0]}
                          width={300}
                          height={200}
                          priority
                          objectFit="cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-auto min-h-60 w-full items-center justify-center bg-gray-200">
                        <span className="text-xl font-bold">
                          {courseDetail.courseName[0] || 'C'}
                        </span>
                      </div>
                    )}
                  </span>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-gray-200">
                    <span className="text-normal font-bold">Uploading...</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <LinkButton
                variant="outline"
                className="w-full flex-1 text-xs"
                url={`/institute/courses/${courseId}/roadmap`}
              >
                View Roadmap
              </LinkButton>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(e) => setActiveModuleId(e.active.id)}
            onDragEnd={handleModuleDragEnd}
          >
            {courseStructure?.length > 0 && (
              <SortableContext
                items={courseStructure?.map((mod) => mod.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="p-2">
                  {modules.map((mod) => (
                    <SortableModule
                      courseId={courseId}
                      key={mod.id}
                      {...mod}
                      id={mod.id}
                      expanded={mod?.expanded}
                      chapters={mod?.chapters}
                      title={mod.name}
                      toggleModule={toggleModule}
                      toggleChapter={toggleChapter}
                      handleChapterDragEnd={handleChapterDragEnd}
                      handleItemDragEnd={handleItemDragEnd}
                    />
                  ))}
                </div>
              </SortableContext>
            )}
            <DragOverlay>
              {activeModuleId ? (
                <div className="rounded border bg-white p-2 shadow">
                  {modules.find((m) => m.id === activeModuleId)?.name}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full items-center justify-center text-sm text-blue-500"
              onClick={async () => {
                const params = new URLSearchParams(searchParams);
                params.set('isAddCourseModuleFlyoutOpen', 'true');

                router.replace(pathname + '?' + params.toString());
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add module
            </Button>
          </div>
        </div>

        <div className="w-[70%]">
          {chapterItemId && <ChapterItemContentArea editable />}
        </div>
      </section>

      <AddCourseModuleFlyout />
      <AddCourseChapterFlyout />
      <AddChapterItemFlyout />
    </>
  );
}
