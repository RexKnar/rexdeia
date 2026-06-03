'use client';

import { useState } from 'react';

import { IdName } from '../_state/types';
import { BulkEditManager } from './BulkEditManager';
import { ExamConfigManager } from './ExamConfigManager';

type Mode = 'single' | 'bulk';

export function EditConfigTab({
  examId,
  classList,
  isClassLoading,
}: {
  examId: string;
  classList: IdName[];
  isClassLoading: boolean;
}) {
  const [mode, setMode] = useState<Mode>('single');

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode('single')}
          className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
            mode === 'single'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          One subject
        </button>
        <button
          type="button"
          onClick={() => setMode('bulk')}
          className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
            mode === 'bulk'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Many subjects (bulk)
        </button>
      </div>

      {mode === 'single' ? (
        <ExamConfigManager
          examId={examId}
          classList={classList}
          isClassLoading={isClassLoading}
        />
      ) : (
        <BulkEditManager
          examId={examId}
          classList={classList}
          isClassLoading={isClassLoading}
        />
      )}
    </div>
  );
}
