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
import { CreditCardIcon, Gem, GripVertical, HeartPulse } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage, Button } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';
import { cn, titilize } from 'utils';

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
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Student
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-start">
            <div className="p-2">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
                <AvatarFallback className="bg-red-300">
                  {row.original.firstName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <p className="text-primary">
                {row.original.firstName} {row.original.middleName}{' '}
                {row.original.lastName}
              </p>
              <div className="flex items-center">
                <CreditCardIcon size={16} className="mr-1 text-green-800" />
                <p className="text-sm text-gray-900">
                  {titilize(row.original.aadharCardNumber)}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center">
                  <Gem size={12} className="mr-1 text-amber-700" />
                  <p className="text-sm text-gray-900">
                    {titilize(row.original.gender)}
                  </p>
                </div>
                <div className="flex items-center">
                  <HeartPulse className="mr-1 text-red-600" size={12} />
                  <p className="text-sm text-gray-800">
                    {row.original.bloodGroup}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'emailId',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
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
            className="px-0"
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
            className="px-0"
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
            className="px-0"
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

  useEffect(() => {
    console.log(studentsList);
  }, [studentsList]);

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
              <TableRow key={headerGroup.id} className="cursor-pointer">
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
                <TableCell className="cursor-pointer text-center text-lg">
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
                  className={cn('cursor-pointer')}
                >
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
