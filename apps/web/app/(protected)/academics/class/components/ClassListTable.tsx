'use client';

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

  const { data: classList, isLoading: isclassListLoading } =
    useGetClassListQuery({
      page,
      limit,
    });
  const widgetsData = Array.from({ length: 11 }, (_, index) => ({
    widgetId: index + 1,
  }));

  // const table = useReactTable({
  //   columns,
  //   data: classList?.data || [],
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  // });

  return (
    <section className=" p-3">
      <div className="flex flex-wrap gap-4">
        {widgetsData.map((widgetData) => (
          <ClassWidget key={widgetData.widgetId} />
        ))}
      </div>
      <div className="mt-4 rounded-md border "></div>
      <When condition={classList?.data?.length && !isclassListLoading}>
        <section className="mt-5 flex justify-between">
          <div className="justify-left flex w-2/6">
            <label className="w-1/3 py-2 text-center text-sm text-gray-700">
              Entries per page
            </label>
            <div className="w-1/3">
              <Select
                value={limit.toString()}
                disabled={isclassListLoading}
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
