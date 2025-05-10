'use client';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialBlock = (type: string) => {
  switch (type) {
    case 'heading':
      return { id: uuidv4(), type, level: 2, content: '' };
    case 'paragraph':
      return { id: uuidv4(), type, content: '' };
    case 'image':
      return { id: uuidv4(), type, src: '', alt: '' };
    case 'list':
      return { id: uuidv4(), type, style: 'unordered', items: [''] };
    case 'code':
      return { id: uuidv4(), type, language: 'javascript', content: '' };
    case 'video':
      return { id: uuidv4(), type, src: '', title: '' };
    default:
      return null;
  }
};

type HeadingBlock = {
  id: string;
  type: 'heading';
  level: number;
  content: string;
};
type ParagraphBlock = { id: string; type: 'paragraph'; content: string };
type ImageBlock = { id: string; type: 'image'; src: string; alt: string };
type ListBlock = { id: string; type: 'list'; style: string; items: string[] };
type CodeBlock = {
  id: string;
  type: 'code';
  language: string;
  content: string;
};
type VideoBlock = { id: string; type: 'video'; src: string; title: string };

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ListBlock
  | CodeBlock
  | VideoBlock;

function SortableItem({
  block,
  renderBlock,
  removeBlock,
  duplicateBlock,
  openInsertMenu,
  insertingAt,
  setInsertingAt,
}: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setInsertingAt(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setInsertingAt]);

  const handleRemoveBlock = (id: string) => {
    // eslint-disable-next-line no-alert
    const confirmationResponse = confirm(
      'Are you sure you want to delete this block?'
    );
    if (confirmationResponse) removeBlock(id);
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative my-4 rounded border bg-white p-2 shadow-sm"
    >
      <div
        className="absolute left-1 top-1 cursor-move"
        {...attributes}
        {...listeners}
      >
        ⠿
      </div>
      <div className="absolute right-2 top-1 flex gap-2">
        <button
          type="button"
          onClick={() => duplicateBlock(block.id)}
          className="text-xl text-blue-500 hover:text-blue-700"
          title="Duplicate"
        >
          📄
        </button>
        <button
          type="button"
          onClick={() => {
            handleRemoveBlock(block.id);
          }}
          className="text-xl text-red-500 hover:text-red-700"
          title="Delete"
        >
          🗑️
        </button>
      </div>
      {renderBlock(block)}

      <div
        className="relative my-4 flex items-center justify-center"
        ref={wrapperRef}
      >
        <div className="absolute h-px w-full bg-gray-300"></div>
        <button
          type="button"
          onClick={() => openInsertMenu(block.id)}
          className="invisible relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-lg text-blue-500 hover:bg-blue-100 group-hover:visible"
        >
          +
        </button>
        {insertingAt === block.id && (
          <div
            className="absolute top-10 z-20 flex gap-2 rounded border bg-white p-2 shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            {['heading', 'paragraph', 'image', 'list', 'code', 'video'].map(
              (type) => (
                <button
                  type="button"
                  key={type}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    openInsertMenu(block.id, type);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="rounded bg-blue-500 px-2 py-1 text-sm text-white"
                >
                  {type}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
interface ContentBuilderProps {
  preFillContent?: any;
  onChange: any;
}
export default function ContentBuilder({
  preFillContent,
  onChange,
}: ContentBuilderProps) {
  const [blocks, setBlocks] = useState<any>([]);
  const [insertingAt, setInsertingAt] = useState<string | null>(null);

  useEffect(() => {
    setBlocks(preFillContent);
  }, []);
  const handleAddBlock = (
    type: string,
    insertAfterId: string | null = null
  ) => {
    const newBlock = initialBlock(type);
    if (!newBlock) return;

    if (!insertAfterId || insertAfterId === 'start') {
      setBlocks((prev) => [...prev, newBlock as Block]);
    } else {
      const index = blocks.findIndex((block) => block.id === insertAfterId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock as Block);
      setBlocks(newBlocks);
      onChange(newBlocks);
    }
    setInsertingAt(null);
  };

  const handleChange = (id: string, key: string, value: any) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, [key]: value } : block
    );

    setBlocks(updatedBlocks);
    onChange(updatedBlocks);
  };

  const handleListItemChange = (id: string, index: number, value: string) => {
    const updatedBlocks = blocks.map((block) => {
      if (block.id === id && block.type === 'list') {
        const items = [...block.items];
        items[index] = value;
        return { ...block, items };
      }
      return block;
    });

    setBlocks(updatedBlocks);
    onChange(updatedBlocks);
  };

  const removeBlock = (id: string) => {
    const newBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const duplicateBlock = (id: string) => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index !== -1) {
      const newBlock = { ...blocks[index], id: uuidv4() };
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
      onChange(newBlocks);
    }
  };

  const renderBlock = (block: Block) => {
    if (!block) return null;
    switch (block.type) {
      case 'heading':
        return (
          <div>
            <select
              value={block.level}
              onChange={(e) =>
                handleChange(block.id, 'level', parseInt(e.target.value))
              }
            >
              {[1, 2, 3, 4, 5, 6].map((l) => (
                <option key={l} value={l}>
                  H{l}
                </option>
              ))}
            </select>
            <input
              className="my-1 w-full border p-1"
              placeholder="Heading text"
              value={block.content}
              onChange={(e) =>
                handleChange(block.id, 'content', e.target.value)
              }
            />
          </div>
        );
      case 'paragraph':
        return (
          <textarea
            className="my-1 w-full border p-2"
            placeholder="Paragraph text"
            value={block.content}
            onChange={(e) => handleChange(block.id, 'content', e.target.value)}
          />
        );
      case 'image':
        return (
          <div className="my-2">
            <input
              type="text"
              className="w-full border p-1"
              placeholder="Image URL"
              value={block.src}
              onChange={(e) => handleChange(block.id, 'src', e.target.value)}
            />
            <input
              type="text"
              className="mt-1 w-full border p-1"
              placeholder="Alt text"
              value={block.alt}
              onChange={(e) => handleChange(block.id, 'alt', e.target.value)}
            />
          </div>
        );
      case 'list':
        return (
          <div className="my-2">
            <select
              value={block.style}
              onChange={(e) => handleChange(block.id, 'style', e.target.value)}
            >
              <option value="unordered">Unordered</option>
              <option value="ordered">Ordered</option>
            </select>
            {block.items.map((item, idx) => (
              <input
                key={idx}
                className="mt-1 w-full border p-1"
                placeholder={`Item ${idx + 1}`}
                value={item}
                onChange={(e) =>
                  handleListItemChange(block.id, idx, e.target.value)
                }
              />
            ))}
            <button
              type="button"
              className="mt-1 text-sm text-blue-500"
              onClick={() =>
                handleChange(block.id, 'items', [...block.items, ''])
              }
            >
              + Add Item
            </button>
          </div>
        );
      case 'code':
        return (
          <div className="my-2">
            <input
              type="text"
              className="w-full border p-1"
              placeholder="Language (e.g. javascript)"
              value={block.language}
              onChange={(e) =>
                handleChange(block.id, 'language', e.target.value)
              }
            />
            <textarea
              className="mt-1 w-full border p-2 font-mono"
              placeholder="Code snippet"
              value={block.content}
              onChange={(e) =>
                handleChange(block.id, 'content', e.target.value)
              }
            />
          </div>
        );
      case 'video':
        return (
          <div className="my-2">
            <input
              type="text"
              className="w-full border p-1"
              placeholder="Video URL"
              value={block.src}
              onChange={(e) => handleChange(block.id, 'src', e.target.value)}
            />
            <input
              type="text"
              className="mt-1 w-full border p-1"
              placeholder="Title"
              value={block.title}
              onChange={(e) => handleChange(block.id, 'title', e.target.value)}
            />
            {block.src && (
              <iframe
                className="mt-2 h-64 w-full"
                src={block.src}
                title={block.title || 'Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      setBlocks(newBlocks);
      onChange(newBlocks);
    }
  };

  return (
    <div className="mx-auto w-full p-4">
      <h1 className="mb-4 text-2xl font-bold">Content Builder</h1>

      {blocks.length === 0 && (
        <div className="relative my-8 flex items-center justify-center">
          <div className="absolute h-px w-full bg-gray-300"></div>
          <button
            type="button"
            onClick={() => setInsertingAt('start')}
            className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-lg text-blue-500 hover:bg-blue-100"
          >
            +
          </button>
          {insertingAt === 'start' && (
            <div className="absolute top-10 z-20 flex gap-2 rounded border bg-white p-2 shadow-md">
              {['heading', 'paragraph', 'image', 'list', 'code', 'video'].map(
                (type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddBlock(type);
                    }}
                    className="rounded bg-blue-500 px-2 py-1 text-sm text-white"
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableItem
              key={block.id}
              block={block}
              renderBlock={renderBlock}
              removeBlock={removeBlock}
              duplicateBlock={duplicateBlock}
              openInsertMenu={(id: string, type?: string) =>
                type ? handleAddBlock(type, id) : setInsertingAt(id)
              }
              insertingAt={insertingAt}
              setInsertingAt={setInsertingAt}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
