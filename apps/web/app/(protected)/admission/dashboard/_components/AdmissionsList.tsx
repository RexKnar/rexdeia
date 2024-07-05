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
import { Button } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';
import { cn } from 'utils';

import { makeAPICall } from '../../../../../lib/api';
import { GET_ADMISSIONS_LIST } from '../../../../../lib/endpoints';

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'student.firstName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name of the Candidate
        </Button>
      );
    },
  },
  {
    accessorKey: 'student.emailId',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email ID
        </Button>
      );
    },
  },
  {
    accessorKey: 'student.phoneNumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Contact Number
        </Button>
      );
    },
  },
  {
    accessorKey: 'student.additionalAttributes.permanentAddress',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Address
        </Button>
      );
    },
  },
];

export function AdmissionsList() {
  const [pageNumber, setPageNumber] = useState(1);
  const [admissionsList, setAdmissionsList] = useState<any[]>([]);

  const [totalPages, setTotalPages] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    makeAPICall<any>(
      GET_ADMISSIONS_LIST,
      {},
      { page: pageNumber, pageSize: 10 }
    ).then((res) => {
      setAdmissionsList(res.data);
      setTotalPages(Math.round(res.total / 10));
    });
  }, [pageNumber]);

  const table = useReactTable({
    columns,
    data: admissionsList || [],
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
    <section>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="cursor-pointer text-lg font-bold"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'cursor-pointer',
                    index % 2 !== 0 && 'cursor-pointer bg-gray-200'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  No Admissions Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4 ">
        <div className="text-muted-foreground flex text-sm">
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {totalPages}
            </strong>
          </span>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              setPageNumber((prev) => prev - 1);
            }}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              setPageNumber((prev) => prev + 1);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
