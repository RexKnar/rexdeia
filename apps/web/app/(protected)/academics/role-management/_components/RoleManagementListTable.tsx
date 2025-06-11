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
import { Pencil, PlusCircleIcon, Trash2 } from 'lucide-react';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

type Role = {
  id: string;
  name: string;
  permissions: string[];
};
export function RoleManagementListTable() {
  const rolesData: Role[] = [
    {
      id: '1',
      name: 'Admin',
      permissions: ['Read', 'Create', 'Update', 'Delete'],
    },
    {
      id: '2',
      name: 'Teacher',
      permissions: ['Read', 'Create', 'Update'],
    },
    {
      id: '3',
      name: 'Student',
      permissions: ['Read'],
    },
  ];
  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: () => (
        <Button variant="ghost" className="px-0">
          Role
        </Button>
      ),
      cell: ({ row }) => <div className="flex">{row.original.name}</div>,
    },
    {
      accessorKey: 'permissions',
      header: () => (
        <Button variant="ghost" className="px-0">
          Module Access
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.permissions.map((perm, index) => (
            <span
              key={index}
              className="px-2 py-1 text-sm font-medium text-indigo-700 bg-blue-100 rounded-full"
            >
              {perm}
            </span>
          ))}

          <Button
            variant="ghost"
            className="flex items-center gap-1 text-sm text-gray-600"
          >
            <PlusCircleIcon size={16} /> Add More
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    columns,
    data: rolesData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section>
      <div className="rounded-md ">
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
                    <TableCell className="ml-3" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="w-52">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="h-auto px-3 py-2 mr-3"
                          variant="mild"
                        >
                          <Pencil
                            size={12}
                            className="text-center text-black"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          <span>Edit</span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button className="h-auto px-3 py-2" variant="mild">
                          <Trash2
                            size={12}
                            className="text-center text-red-600 "
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          <span>Delete</span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center"></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
