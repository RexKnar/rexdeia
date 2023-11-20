'use client';

import { GripVertical } from 'lucide-react';
import { Button } from 'ui';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';
import { cn } from 'utils';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { makeAPICall } from '../../../../../lib/api';
import { GET_STUDENTS_LIST } from '../../../../../lib/endpoints';

export function StudentsList() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'firstName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Student Name
          </Button>
        );
      },
    },
    {
      accessorKey: 'emailId',
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
      accessorKey: 'rollNumber',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Roll No
          </Button>
        );
      },
    },
    {
      accessorKey: 'additionalAttributes.mobileNumber',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Mobile Number
          </Button>
        );
      },
    },
    {
      accessorKey: 'class',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Class
          </Button>
        );
      },
    },
  ];

  const [pageNumber, setPageNumber] = useState(1);
  const [studentsList, setStudentsList] = useState<any[]>([]);

  const [totalPages, setTotalPages] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    makeAPICall<any>(
      GET_STUDENTS_LIST,
      {},
      { page: pageNumber, pageSize: 10 }
    ).then((res) => {
      setStudentsList(res.data);
      setTotalPages(Math.ceil(res.total / 10));
    });
  }, [pageNumber]);

  const table = useReactTable({
    columns,
    data: studentsList || [],
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
              <TableRow key={headerGroup.id} className="cursor-pointer text-lg">
                <TableHead className="cursor-pointer text-center ">
                  S.no
                </TableHead>
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
                <TableCell className="cursor-pointer text-center text-lg ">
                  Actions
                </TableCell>
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
                  <TableCell>{index + 1}</TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="flex items-center justify-center">
                    <Button variant="destructive" className="mr-1 ">
                      <GripVertical size={16} className="mr-2 text-black" />
                    </Button>
                  </TableCell>
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
      <div className="flex items-center justify-between space-x-2 py-4">
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
