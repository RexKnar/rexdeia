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
// import { useDeleteGradeScaleMutationQuery } from 'lib/queries/grade/useDeleteGradeScaleMutationQuery';
import { Pencil, PlusCircleIcon, Trash2 } from 'lucide-react';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import React, { useCallback, useEffect, useState } from 'react';
// import { When } from 'react-if';
import {
  Button,
  // Pagination,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  // useToast,
} from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

// import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
// import { GradeModel, gradeScales } from '../../../../../lib/domain/grade';
// import { useGetGradeList } from '../../../../../lib/queries/grade/useGetGradeListMutationQuery';

type Role = {
  id: string;
  name: string;
  permissions: string[];
};
export function RoleManagementListTable() {
  // const { toast } = useToast();

  // const pathname = usePathname();
  // const router = useRouter();
  // const searchParams = useSearchParams();
  const rolesData: Role[] = [
    {
      id: '1',
      name: 'Admin',
      permissions: ['Read', 'Create', 'Update', 'Delete'], // All access
    },
    {
      id: '2',
      name: 'Teacher',
      permissions: ['Read', 'Create', 'Update'], // No delete
    },
    {
      id: '3',
      name: 'Student',
      permissions: ['Read'], // Read-only
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

  // const page = parseInt(searchParams.get('page')) || 1;
  // const limit = parseInt(searchParams.get('limit')) || 10;

  // const { data: getGradeListResponse, isLoading: isGradeListLoading } =
  //   useGetGradeList({ page, limit });

  const table = useReactTable({
    columns,
    data: rolesData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // const handleOnPageChange = useCallback(
  //   (page: number) => {
  //     const params = new URLSearchParams(searchParams);
  //     params.set('page', page.toString());

  //     router.push(pathname + '?' + params.toString());
  //   },
  //   [searchParams, pathname, router]
  // );

  // const {
  //   isError: isDeleteGradeScaleError,
  //   isSuccess: isDeleteGradeScaleSuccess,
  //   isPending: isDeleteGradeScalePending,
  //   mutateAsync: deleteGradeScaleAsync,
  // } = useDeleteGradeScaleMutationQuery(page, limit);
  // useEffect(() => {
  //   if (isDeleteGradeScaleError) {
  //     toast({
  //       title: 'Error',
  //       variant: 'default',
  //       description: 'Error while deleting scale',
  //     });
  //   }
  // }, [isDeleteGradeScaleError, toast]);

  // useEffect(() => {
  //   if (isDeleteGradeScaleSuccess) {
  //     toast({
  //       title: 'Success',
  //       variant: 'default',
  //       description: 'Scale deleted successfully',
  //     });
  //     setSelectedGradeScale(null);
  //   }
  // }, [isDeleteGradeScaleSuccess, toast]);
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
                <TableCell colSpan={5} className="h-24 text-center">
                  {/* {isGradeListLoading ? 'Loading...' : 'No Grade Found'} */}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <When
        condition={getGradeListResponse?.data?.length && !isGradeListLoading}
      >
        <Pagination
          limit={limit.toString()}
          onPageChange={handleOnPageChange}
          pageSize={getGradeListResponse?.limit || 0}
          totalRecords={getGradeListResponse?.total || 0}
          disabled={isGradeListLoading}
          onLimitChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.set('limit', value.toString());

            router.replace(pathname + '?' + params.toString());
          }}
        />
      </When> */}
    </section>
  );
}
