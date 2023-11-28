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
import { ChevronDown, GripVertical } from 'lucide-react';
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

import { useGetRegulationListQuery } from '../../../../../lib/queries/useGetRegulationListQuery';

export function RegulationListTable() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'regulationName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Regulation Name
          </Button>
        );
      },
    },
    {
      accessorKey: 'announcedYear',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Announced Year
          </Button>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Active Status
          </Button>
        );
      },
    },
  ];

  const { data: regulationList } = useGetRegulationListQuery();
  const table = useReactTable({
    columns,
    data: regulationList || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="cursor-pointer text-lg "
              >
                <TableHead className="cursor-pointer font-bold">S.no</TableHead>
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
                <TableHead className="cursor-pointer font-bold">
                  Actions
                </TableHead>
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
                    index % 2 !== 0 && 'bg-white-200 cursor-pointer'
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
                  <TableCell>
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
                  No Regulation Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <div className="mt-7 flex justify-between">
          <div className="flex items-center text-sm font-normal text-gray-700">
            Entries per page
            <div className="flex items-center border">
              <span className="px-2 py-1 text-black ">10</span>
              <ChevronDown size={14} className="mr-1" />
            </div>
          </div>
          <div className="flex">
            <div className="px-3 py-1 text-sm font-normal text-gray-700">
              First
            </div>
            <div className="px-3 py-1 text-sm font-normal text-gray-700">1</div>
            <div className="bg-gray-200 px-3 py-1 text-sm font-normal text-primary-800">
              2
            </div>
            <div className="px-3 py-1 text-sm font-normal text-gray-700">
              ...
            </div>
            <div className="px-3 py-1 text-sm font-normal text-gray-700">7</div>
            <div className="px-3 py-1 text-sm font-normal text-gray-700">8</div>
            <div className="px-3 py-1 text-sm font-normal text-gray-700">
              Last
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
