'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import {
  Button,
  Pagination,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useToast,
} from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

type RoleModel = {
  id: string;
  name: string;
  assignedDate: string;
  isActive: boolean;
};

const dummyRoles: RoleModel[] = [
  {
    id: '1',
    name: 'Admin',
    assignedDate: '2025-06-01T10:00:00Z',
    isActive: true,
  },
  {
    id: '2',
    name: 'Teacher',
    assignedDate: '2025-05-28T14:30:00Z',
    isActive: false,
  },
];

const UserRoleList = () => {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const [data] = useState<RoleModel[]>(dummyRoles);

  const handleEditRole = (role: RoleModel) => {
    const params = new URLSearchParams(searchParams);
    params.set('isEditRoleFlyoutOpen', 'true');
    params.set('roleId', role.id);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDeleteRole = (role: RoleModel) => {
    toast({
      title: 'Delete Clicked',
      description: `You clicked delete on ${role.name}`,
    });
  };

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );
  const columns: ColumnDef<RoleModel>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: 'assignedDate',
      header: 'Assigned On',
      cell: ({ row }) => new Date(row.original.assignedDate),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={`rounded px-2 py-1 text-sm font-medium text-white ${
            row.original.isActive ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {row.original.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="mild"
                  className="h-8 w-8 p-1"
                  onClick={() => handleEditRole(row.original)}
                >
                  <Pencil size={16} className="text-gray-800" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="mild"
                  className="h-8 w-8 p-1"
                  onClick={() => handleDeleteRole(row.original)}
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className="mt-4 rounded-md border bg-white p-4 shadow-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No roles found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination
        limit={limit.toString()}
        pageNumber={page}
        totalRecords={dummyRoles.length}
        pageSize={limit}
        onPageChange={handlePageChange}
        disabled={false}
        onLimitChange={(value) => {
          const params = new URLSearchParams(searchParams);
          params.set('limit', value.toString());
          router.push(`${pathname}?${params.toString()}`);
        }}
      />
    </section>
  );
};

export default UserRoleList;
