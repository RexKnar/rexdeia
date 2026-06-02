'use client';

import { Trash2 } from 'lucide-react';
import { ReactNode } from 'react';
import { Badge, Input, Switch } from 'ui';

import { IdName, SharedPartition, SharedSubjectMarks } from '../_state/types';

/** Subject-level marks row (Total / Convert to / Min pass). */
export function MarksRow({
  marks,
  onChange,
}: {
  marks: SharedSubjectMarks;
  onChange: (patch: Partial<SharedSubjectMarks>) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Field label="Total marks">
        <Input
          type="number"
          value={marks.totalMarks}
          placeholder="100"
          onChange={(e) => onChange({ totalMarks: e.target.value })}
        />
      </Field>
      <Field label="Convert to">
        <Input
          type="number"
          value={marks.convertTo}
          placeholder="50"
          onChange={(e) => onChange({ convertTo: e.target.value })}
        />
      </Field>
      <Field label="Min pass mark">
        <Input
          type="number"
          value={marks.minMark}
          placeholder="35"
          onChange={(e) => onChange({ minMark: e.target.value })}
        />
      </Field>
    </div>
  );
}

/** Toggle chips + editable cards for assessment-format partitions. */
export function PartitionList({
  partitions,
  formats,
  formatsLoading,
  onToggleFormat,
  onUpdate,
  onRemove,
}: {
  partitions: SharedPartition[];
  formats: IdName[];
  formatsLoading?: boolean;
  onToggleFormat: (format: IdName) => void;
  onUpdate: (key: string, patch: Partial<SharedPartition>) => void;
  onRemove: (key: string) => void;
}) {
  const active = (id: string) => partitions.some((p) => p.key === id);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Assessment formats
        </p>
        {formatsLoading ? (
          <p className="text-sm text-gray-400">Loading formats…</p>
        ) : formats.length === 0 ? (
          <p className="text-sm text-gray-400">
            Select subjects above to load their assessment formats.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {formats.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onToggleFormat(f)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  active(f.id)
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-primary/40'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {partitions
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((p) => (
          <div
            key={p.key}
            className="rounded-lg border border-gray-200 bg-gray-50/60 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-gray-800">
                {p.name}
                <Badge variant="outline" size="xs">
                  order {p.order}
                </Badge>
              </span>
              <button
                type="button"
                onClick={() => onRemove(p.key)}
                className="text-gray-400 hover:text-red-500"
                aria-label={`Remove ${p.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <Field label="Marks to conduct">
                <Input
                  type="number"
                  value={p.totalMarks}
                  onChange={(e) =>
                    onUpdate(p.key, { totalMarks: e.target.value })
                  }
                />
              </Field>
              <Field label="Convert to">
                <Input
                  type="number"
                  value={p.convertTo}
                  onChange={(e) =>
                    onUpdate(p.key, { convertTo: e.target.value })
                  }
                />
              </Field>
              <Field label="Min pass">
                <Input
                  type="number"
                  value={p.minMark}
                  onChange={(e) => onUpdate(p.key, { minMark: e.target.value })}
                />
              </Field>
              <Field label="Date to conduct">
                <Input
                  type="date"
                  value={p.dateToConduct}
                  onChange={(e) =>
                    onUpdate(p.key, { dateToConduct: e.target.value })
                  }
                />
              </Field>
              <Field label="Order">
                <Input
                  type="number"
                  value={p.order}
                  onChange={(e) =>
                    onUpdate(p.key, { order: Number(e.target.value) })
                  }
                />
              </Field>
              <div className="flex items-end gap-2 pb-1">
                <Switch
                  checked={p.excludeSubjectValidation}
                  onCheckedChange={(v) =>
                    onUpdate(p.key, { excludeSubjectValidation: Boolean(v) })
                  }
                />
                <span className="text-sm text-gray-600">
                  Exclude in pass criteria
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </span>
      {children}
    </label>
  );
}

/** Builds a fresh partition for a newly-toggled format. */
export function makePartition(format: IdName, order: number): SharedPartition {
  return {
    key: format.id,
    name: format.name,
    assessmentFormatId: format.id,
    totalMarks: '',
    convertTo: '',
    minMark: '',
    dateToConduct: '',
    order,
    excludeSubjectValidation: false,
  };
}
