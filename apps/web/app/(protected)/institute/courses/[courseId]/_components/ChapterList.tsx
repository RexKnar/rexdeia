'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'ui';

import { ChapterItems } from './ChapterItems';

export const ChapterList = ({
  id,
  title,
  expanded,
  chapterItems,
  toggleChapter,
}) => {
  return (
    <div className="mb-2 ml-4">
      <Collapsible open={expanded}>
        <div className="group flex cursor-pointer items-center justify-between">
          <div className="flex items-center">
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
        </div>

        <CollapsibleContent>
          <div className="mt-1 space-y-1 pl-8">
            {chapterItems.map((item) => (
              <ChapterItems key={item.id} id={item.id} title={item.name} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
