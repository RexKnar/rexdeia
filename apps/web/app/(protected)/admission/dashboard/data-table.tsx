'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { Input } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';
import { AdmissionTableFooter } from '../../../../lib/components/admission/admissionTableFooter';
import { makeAPICall } from '../../../../lib/api';
import { LIST_ADMISSION } from '../../../../lib/endpoints';
import { useSearchParams } from 'next/navigation';
import { AdmissionListModel } from './columns';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
}: DataTableProps<TData, TValue>) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const tablePaginationLimit = Number(
    searchParams.get('tablePaginationLimit') ?? '5'
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [currentList, setCurrentList] = useState([]);
  const pageValue = (page - 1) * tablePaginationLimit;

  useEffect(() => {
    async function getData() {
      try {
        const admissionList = await makeAPICall(LIST_ADMISSION, {
          pageValue,
          tablePaginationLimit,
        });
        const data: AdmissionListModel[] = JSON.parse(
          JSON.stringify(admissionList)
        );
        setCurrentList(data.map((x, i) => ({ slNo: i + 1, ...x })));
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [page, tablePaginationLimit, pageValue]);

  data = currentList;
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter mobile..."
          value={
            (table.getColumn('mobileNumber')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('mobileNumber')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="text-lg font-bold" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AdmissionTableFooter totalCount={totalCount} />
    </div>
  );
}
