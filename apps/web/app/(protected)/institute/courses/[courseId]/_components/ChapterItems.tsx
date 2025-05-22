'use client';

import { FileText } from 'lucide-react';

import { useQueryParams } from '@/hooks/useQueryParams';

export const ChapterItems = ({ id, title }) => {
  const { setParams } = useQueryParams();

  const loadChapterItem = () => {
    setParams({
      chapterItemId: id,
    });
  };

  return (
    <div className="group flex cursor-pointer justify-between py-1">
      <div className="flex items-center gap-2">
        <FileText className="mr-2 h-4 w-4 text-gray-700" />
        <span className="text-xs" onClick={() => loadChapterItem()}>
          {title}
        </span>
      </div>
    </div>
  );
};
