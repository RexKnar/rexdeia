'use client';

import { BookmarkPlus, Layers3, Trash2 } from 'lucide-react';
import { Dispatch, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useToast,
} from 'ui';

import {
  ConfigAction,
  ConfigState,
  SharedPartition,
  SharedSubjectMarks,
} from '../_state/types';

/**
 * Reusable config templates.
 *
 * NOTE: there is no template endpoint in the codebase yet, so this is backed by
 * the browser's localStorage and is therefore per-device/per-browser. Once a
 * backend route exists, swap `loadTemplates`/`saveTemplates` for query hooks.
 */
const STORAGE_KEY = 'exam-config-templates:v1';

type Template = {
  id: string;
  name: string;
  marks: SharedSubjectMarks;
  partitions: SharedPartition[];
};

function loadTemplates(): Template[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveTemplates(list: Template[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function TemplatesMenu({
  state,
  dispatch,
}: {
  state: ConfigState;
  dispatch: Dispatch<ConfigAction>;
}) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  const persist = (list: Template[]) => {
    setTemplates(list);
    saveTemplates(list);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const tpl: Template = {
      id: `${name.trim()}-${state.partitions.length}-${state.subjectMarks.totalMarks}`,
      name: name.trim(),
      marks: state.subjectMarks,
      partitions: state.partitions,
    };
    persist([...templates.filter((t) => t.name !== tpl.name), tpl]);
    setName('');
    toast({
      title: 'Template saved',
      description: `"${tpl.name}" is ready to reuse.`,
    });
  };

  const apply = (tpl: Template) => {
    dispatch({
      type: 'APPLY_TEMPLATE',
      marks: tpl.marks,
      partitions: tpl.partitions,
    });
    toast({ title: 'Template applied', description: `Loaded "${tpl.name}".` });
  };

  const canSave = state.partitions.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Layers3 size={15} className="mr-2" /> Templates
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white p-3">
        <p className="mb-2 text-sm font-semibold text-gray-800">
          Config templates
        </p>

        <div className="mb-3 flex gap-2">
          <Input
            value={name}
            placeholder="Save current as…"
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!canSave || !name.trim()}
          >
            <BookmarkPlus size={15} />
          </Button>
        </div>
        {!canSave && (
          <p className="mb-2 text-xs text-gray-400">
            Build a shared config first to save it as a template.
          </p>
        )}

        <div className="max-h-56 space-y-1 overflow-y-auto">
          {templates.length === 0 ? (
            <p className="text-xs text-gray-400">No templates saved yet.</p>
          ) : (
            templates.map((tpl) => (
              <div
                key={tpl.id}
                className="flex items-center justify-between rounded-md border border-gray-100 px-2 py-1.5"
              >
                <button
                  type="button"
                  className="flex flex-1 items-center gap-2 text-left text-sm text-gray-700 hover:text-primary"
                  onClick={() => apply(tpl)}
                >
                  {tpl.name}
                  <Badge variant="outline" size="xs">
                    {tpl.partitions.length} fmt
                  </Badge>
                </button>
                <button
                  type="button"
                  className="text-gray-300 hover:text-red-500"
                  onClick={() =>
                    persist(templates.filter((t) => t.id !== tpl.id))
                  }
                  aria-label={`Delete ${tpl.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <p className="mt-2 text-[11px] leading-tight text-gray-400">
          Templates are stored in this browser only.
        </p>
      </PopoverContent>
    </Popover>
  );
}
