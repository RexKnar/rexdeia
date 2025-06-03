'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { usePaymentHistoryByLearnerIdQuery } from 'lib/queries/institute/learners/payment/usePaymentHistoryByLearnerIdQuery';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import { When } from 'react-if';
import { Button, Pagination } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';
import { cn } from 'utils';

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'course',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Course Name
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.course.courseName}</span>;
    },
  },
  {
    accessorKey: 'discountAmount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Course Fee
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.discountAmount}</span>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{new Date(row.original.createdAt).toString()}</span>;
    },
  },
  {
    accessorKey: 'paidFullPayment',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span
          className={cn(
            'ml-1 rounded px-2 py-1 text-center text-sm font-medium text-gray-100',
            row.original.paidFullPayment ? 'bg-green-600' : 'bg-red-600'
          )}
        >
          {row.original.paidFullPayment ? 'Fully Paid' : 'Partially Paid'}
        </span>
      );
    },
  },
];

export function CourseBills() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const filter = {};

  const { data: paymentListResponse, isLoading: isPaymentListLoading } =
    usePaymentHistoryByLearnerIdQuery({
      page,
      limit,
      filter,
    });

  const handleOnPageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());

      router.push(pathname + '?' + params.toString());
    },
    [searchParams, pathname, router]
  );
  const table = useReactTable({
    columns,
    data: paymentListResponse?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <section>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="cursor-pointer hover:bg-white"
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
                <TableHead>
                  <Button variant="ghost" className="px-0">
                    Actions
                  </Button>
                </TableHead>
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
                <TableCell colSpan={5} className="h-24 text-center">
                  {isPaymentListLoading ? 'Loading...' : 'No Bills Found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <When
        condition={paymentListResponse?.data?.length && !isPaymentListLoading}
      >
        <Pagination
          limit={limit.toString()}
          onPageChange={handleOnPageChange}
          pageSize={paymentListResponse?.limit || 0}
          totalRecords={paymentListResponse?.total || 0}
          disabled={isPaymentListLoading}
          onLimitChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.set('limit', value.toString());

            router.push(pathname + '?' + params.toString());
          }}
        />
      </When>
    </section>
  );
}
