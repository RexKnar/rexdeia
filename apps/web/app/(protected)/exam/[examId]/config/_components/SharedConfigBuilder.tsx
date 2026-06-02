'use client';

import { SlidersHorizontal } from 'lucide-react';
import { Dispatch } from 'react';

import { ConfigAction, ConfigState, IdName } from '../_state/types';
import { makePartition, MarksRow, PartitionList } from './ConfigFields';

export function SharedConfigBuilder({
  state,
  dispatch,
  formats,
  formatsLoading,
}: {
  state: ConfigState;
  dispatch: Dispatch<ConfigAction>;
  formats: IdName[];
  formatsLoading: boolean;
}) {
  const toggleFormat = (format: IdName) => {
    const exists = state.partitions.some((p) => p.key === format.id);
    if (exists) {
      dispatch({ type: 'REMOVE_PARTITION', key: format.id });
    } else {
      dispatch({
        type: 'ADD_PARTITION',
        partition: makePartition(format, state.partitions.length + 1),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <SlidersHorizontal size={16} className="text-primary" />
        Shared configuration
        <span className="font-normal text-gray-400">
          — applied to every selected subject &amp; section
        </span>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Subject marks
        </p>
        <MarksRow
          marks={state.subjectMarks}
          onChange={(patch) =>
            dispatch({ type: 'SET_SUBJECT_MARKS', marks: patch })
          }
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <PartitionList
          partitions={state.partitions}
          formats={formats}
          formatsLoading={formatsLoading}
          onToggleFormat={toggleFormat}
          onUpdate={(key, patch) =>
            dispatch({ type: 'UPDATE_PARTITION', key, patch })
          }
          onRemove={(key) => dispatch({ type: 'REMOVE_PARTITION', key })}
        />
      </div>
    </div>
  );
}
