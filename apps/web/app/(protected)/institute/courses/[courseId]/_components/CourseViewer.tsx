'use client';

import { InstituteCourseModuleModel } from 'lib/domain/institute/module';
import { useGetCourseContentStructureQuery } from 'lib/queries/institute/course/contentStructure/useGetCourseContentStructureQuery';
import { useGetInstituteCourseDetailByIdQuery } from 'lib/queries/institute/course/useGetInstituteCourseDetailByIdQuery';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner } from 'ui';

import { LinkButton } from '@/components/LinkButton';
import { useQueryParams } from '@/hooks/useQueryParams';

import ChapterItemContentArea from '../builder/_components/ChapterItemContentArea';
import { ModuleList } from './ModuleList';

export default function CourseViewer() {
  const [modules, setModules] = useState<InstituteCourseModuleModel[]>([]);
  const { setParams } = useQueryParams();

  const searchParams = useSearchParams();
  const routeParams = useParams<{ courseId: string; chapterItemId: string }>();

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

  useEffect(() => {
    if (courseStructure) {
      setModules(courseStructure);
      const tempModules = courseStructure[0];
      const tempChapters = tempModules.chapters[0];
      const tempChapterItems = tempChapters.chapterItems[0];
      setParams({
        chapterItemId: tempChapterItems.id || '',
      });
    }
  }, [courseStructure]);

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

  return (
    <section className="relative flex w-full gap-2">
      <div className="sticky top-10 h-screen w-[30%] overflow-y-auto border-r border-gray-200 bg-white">
        <div className="border-b p-4">
          <div className="relative flex items-center justify-center rounded-md bg-gray-100 p-8">
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
                  <span className="text-normal font-sm">Loading...</span>
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

        {courseStructure?.length > 0 && (
          <div className="p-2">
            {modules.map((mod) => (
              <ModuleList
                key={mod.id}
                {...mod}
                id={mod.id}
                expanded={mod?.expanded}
                chapters={mod?.chapters}
                title={mod.name}
                toggleModule={toggleModule}
                toggleChapter={toggleChapter}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-[70%] bg-white p-4">
        {chapterItemId ? (
          <ChapterItemContentArea editable={false} />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <span className="text-normal font-sm">Loading...</span>
            <Spinner />
          </div>
        )}
      </div>
    </section>
  );
}
