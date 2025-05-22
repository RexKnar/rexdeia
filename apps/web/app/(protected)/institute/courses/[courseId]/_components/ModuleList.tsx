'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'ui';

import { ChapterList } from './ChapterList';

export const ModuleList = ({
  id,
  title,
  chapters,
  expanded,
  toggleModule,
  toggleChapter,
}) => {
  return (
    <div className="mb-4">
      <Collapsible open={expanded}>
        <div className="group mb-1 flex items-center bg-gray-100 px-2 py-1 font-semibold">
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

        <CollapsibleContent>
          {chapters.map((chapter) => (
            <ChapterList
              key={chapter.id}
              {...chapter}
              title={chapter?.name}
              toggleChapter={toggleChapter}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
