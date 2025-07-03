'use client';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useGetRoleDetailsByIdQuery } from 'lib/queries/role-management/useGetRoleDetailsByIdQuery';
import { Pencil, Trash2 } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button, Tooltip, TooltipContent, TooltipTrigger, useToast } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

import { PageTitle } from '@/components/PageTitle';

// Define the type for user data in the role

const UserRoleList = () => {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const roleId = useParams<{ roleId: string }>().roleId;

  const [userList, setUserList] = useState<any[]>([]);

  const { data: roleDetailsResponse } = useGetRoleDetailsByIdQuery(roleId);
  useEffect(() => {
    if (roleDetailsResponse) {
      setUserList(roleDetailsResponse?.UserOrganization);
    }
  }, [roleDetailsResponse]);

  const handleEditRole = (role: any) => {
    const params = new URLSearchParams(searchParams);
    params.set('isEditRoleFlyoutOpen', 'true');
    params.set('roleId', role.id);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDeleteRole = (role: any) => {
    toast({
      title: 'Delete Clicked',
      description: `You clicked delete on ${role.user.name}`,
    });
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'user.name', // 'user.name' will point to the name of the user in the user object
      header: 'Name',
      cell: ({ row }) => row.original.user.name,
    },
    {
      accessorKey: 'user.role', // 'user.role' will point to the role of the user
      header: 'User Type',
      cell: ({ row }) => row.original.user.role,
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
    data: userList, // Make sure 'data' is passed here
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className="mt-4 rounded-md border bg-white p-4 shadow-sm">
      <div className="flex justify-between pb-3">
        <PageTitle title={roleDetailsResponse?.name ?? 'Role Details'} />
      </div>
      <hr className="border-t border-gray-300" />
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
    </section>
  );
};

export default UserRoleList;
