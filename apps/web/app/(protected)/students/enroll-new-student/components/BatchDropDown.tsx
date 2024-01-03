'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { useEffect, useState } from 'react';
import { Button, Popover, PopoverContent, PopoverTrigger, Text } from 'ui';
import { cn } from 'utils';

import { useGetBatchesListQuery } from '../../../../../lib/queries/batches/useGetBatchesListQuery';

export function BatchDropDown() {
  const [open, setOpen] = useState(false);

  const { batches } = useGetBatchesListQuery({
    page: 1,
    limit: 999,
  });

  const [batchId, setBatchId] = useQueryState('batchId', parseAsString);

  useEffect(() => {
    if (batches?.length) {
      setBatchId(batches[batches.length - 1].id);
    }
  }, [batches, setBatchId]);

  return (
    <div className="w-full">
      <label className="mb-2 mt-1 block text-sm text-gray-700">
        Batch
        <span className="text-red-300"> *</span>
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            variant="outline"
            aria-expanded={open}
            disabled={!batches?.length}
            className="ring-offset-background placeholder:text-muted-foreground  focus-visible:ring-ring mt-1 flex h-10 w-full justify-between rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-700 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {batchId
              ? batches.find((framework) => framework.id === batchId).name
              : 'Select Batch'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <section className="overflow-x-hidden overflow-y-scroll">
            {batches?.map((batch) => (
              <div
                key={batch.id}
                className="my-2 grid h-12 cursor-pointer grid-cols-[32px_minmax(168px,_1fr)] items-center gap-3 py-1 hover:bg-gray-300"
              >
                <div className="flex items-center justify-center">
                  <Check
                    className={cn(
                      'h-4 w-4',
                      batchId === batch.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <Text
                    variant="sm-regular"
                    className="line-clamp-1 truncate break-all"
                  >
                    {batch.name}
                  </Text>
                  <Text variant="xs-regular" className="text-gray-800">
                    {batch.startYear} - {batch.endYear}
                  </Text>
                </div>
              </div>
            ))}
          </section>
        </PopoverContent>
      </Popover>
    </div>
  );
}
