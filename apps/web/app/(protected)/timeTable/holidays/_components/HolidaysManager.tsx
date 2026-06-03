'use client';

import {
  useDeleteHolidayMutationQuery,
  useGetHolidaysQuery,
  useSaveHolidayMutationQuery,
} from 'lib/queries/timetable/useHolidaysQuery';
import { CalendarPlus, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button, Input, toast } from 'ui';

function fmt(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function HolidaysManager() {
  const { data, isLoading } = useGetHolidaysQuery({});
  const saveMutation = useSaveHolidayMutationQuery();
  const deleteMutation = useDeleteHolidayMutationQuery();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const add = async () => {
    if (!name || !startDate) {
      toast({ title: 'Name and start date are required', variant: 'default' });
      return;
    }
    try {
      await saveMutation.mutateAsync({
        name,
        description,
        startDate,
        endDate: endDate || startDate,
      });
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      toast({ title: 'Holiday added', variant: 'default' });
    } catch {
      toast({ title: 'Error adding holiday', variant: 'default' });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-md border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <CalendarPlus size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-800">Add Holiday</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600">
              Name
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Start date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              End date (optional)
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="default"
              onClick={add}
              disabled={saveMutation.isPending}
              className="w-full"
            >
              {saveMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                'Add'
              )}
            </Button>
          </div>
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-gray-600">
              Description (optional)
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="overflow-x-auto rounded-md border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-600">
              <th className="p-3">Holiday</th>
              <th className="p-3">Dates</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
                </td>
              </tr>
            ) : !data?.length ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No holidays added for this academic year.
                </td>
              </tr>
            ) : (
              data.map((h) => (
                <tr key={h.id} className="border-b">
                  <td className="p-3">
                    <p className="font-medium text-gray-800">{h.name}</p>
                    {h.description && (
                      <p className="text-xs text-gray-500">{h.description}</p>
                    )}
                  </td>
                  <td className="p-3 text-gray-700">
                    {h.startDate === h.endDate
                      ? fmt(h.startDate)
                      : `${fmt(h.startDate)} – ${fmt(h.endDate)}`}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="mild"
                      className="h-auto px-2 py-1"
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(h.id)}
                    >
                      <Trash2 size={14} className="text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
