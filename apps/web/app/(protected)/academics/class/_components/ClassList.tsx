'use client';

import { Loader2 } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'next-usequerystate';
import React from 'react';
import { When } from 'react-if';
import {
  Pagination,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';

import { useGetClassListQuery } from '../../../../../lib/queries/class/useGetClassListQuery';
import { ClassWidget } from './ClassWidget';

export function ClassList() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState(
    'limit',
    parseAsInteger.withDefault(10)
  );

  const { data: classList, isLoading: isClassListLoading } =
    useGetClassListQuery({
      page,
      limit,
    });

  if (isClassListLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
        Fetching
      </div>
    );
  }
  return (
    <section className="p-3">
      <When condition={classList.data.length}>
        <div className="flex flex-wrap gap-4">
          {classList.data.map((widgetData) => (
            <ClassWidget classDetails={widgetData} key={widgetData.id} />
          ))}
        </div>
        <div className="mt-4 rounded-md border "></div>
        <section className="mt-5 flex justify-between">
          <div className="justify-left flex w-2/6">
            <label className="w-1/3 py-2 text-center text-sm text-gray-700">
              Entries per page
            </label>
            <div className="w-1/3">
              <Select
                value={limit.toString()}
                disabled={isClassListLoading}
                onValueChange={async (value) => {
                  await setLimit(parseInt(value));
                }}
              >
                <SelectTrigger className="w-auto ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={'10'}>10</SelectItem>
                    <SelectItem value={'25'}>25</SelectItem>
                    <SelectItem value={'50'}>50</SelectItem>
                    <SelectItem value={'100'}>100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Pagination
            onPageChange={setPage}
            pageSize={classList?.limit || 0}
            totalRecords={classList?.total || 0}
          />
        </section>
      </When>
    </section>
  );
}
