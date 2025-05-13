'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, GripVertical } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'ui';

export default function SortableFAQItem({ faq, openId, setOpenId }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: faq.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOpen = openId === faq.id;

  return (
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
          <CollapsibleTrigger asChild>
            <button
              className="flex w-full items-center justify-between text-left"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
            >
              <span className="text-left text-sm font-medium text-gray-800">
                {faq.question}
              </span>
              <ChevronDown
                className={`ml-2 h-4 w-4 text-black transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-2 pl-8 text-sm text-gray-800 ">
          {faq.answer}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
