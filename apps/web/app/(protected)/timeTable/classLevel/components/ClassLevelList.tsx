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
import { ClassLevelModel } from 'lib/domain/classLevel';
import { useDeleteClassLevelMutationQuery } from 'lib/queries/classLevel/useDeleteClassLevelMutationQuery';
import { useGetClassLevelListQuery } from 'lib/queries/classLevel/useGetClassLevelsListQuery';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { When } from 'react-if';
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
import { cn } from 'utils';

import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

const columns: ColumnDef<ClassLevelModel>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Class Level Name
      </Button>
    ),
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
      </Button>
    ),
    cell: ({ row }) => (
      <span
        className={cn(
          'ml-1 rounded px-2 py-1 text-center text-sm font-medium text-gray-100',
          row.original.isActive ? 'bg-green-600' : 'bg-red-600'
        )}
      >
        {row.original.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

export function ClassLevelListTable() {
  const { toast } = useToast();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedClassLevel, setSelectedClassLevel] =
    useState<ClassLevelModel | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = useMemo(
    () => parseInt(searchParams.get('page')) || 1,
    [searchParams]
  );
  const limit = useMemo(
    () => parseInt(searchParams.get('limit')) || 10,
    [searchParams]
  );

  const { data: classLevelResponse, isLoading: isClassLevelLoading } =
    useGetClassLevelListQuery({
      page,
      limit,
    });

  const {
    isError: isDeleteClasslevelError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteClassLevelAsync,
  } = useDeleteClassLevelMutationQuery(page, limit);

  useEffect(() => {
    if (isDeleteClasslevelError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting classlevel',
      });
    }
  }, [isDeleteClasslevelError, toast]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Classlevel deleted successfully',
      });
      setSelectedClassLevel(null);
    }
  }, [isDeleteSuccess, toast]);

  const handleOnPageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());

      router.push(pathname + '?' + params.toString());
    },
    [searchParams, pathname, router]
  );

  const handleLimitChange = useCallback(
    (value: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('limit', value.toString());

      router.push(pathname + '?' + params.toString());
    },
    [searchParams, pathname, router]
  );

  const table = useReactTable({
    columns,
    data: classLevelResponse?.data || [],
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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                  <TableCell className="w-52">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('SaveClassLevelFlyout', 'true');
                            params.set('classLevelId', row.original.id);
                            router.push(pathname + '?' + params.toString());
                          }}
                          className="mr-2 h-auto px-3 py-2"
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
                        <Button
                          className="h-auto px-3 py-2"
                          variant="mild"
                          onClick={() => {
                            setSelectedClassLevel(row.original);
                            setShowDeleteConfirmationModal(true);
                          }}
                          // disabled={
                          //   row.original.isNewlyAdded || row.original.isUpdating
                          // }
                        >
                          {row.original.isDeleted ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-red-600" />
                          ) : (
                            <Trash2
                              size={12}
                              className="text-center text-red-600 "
                            />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          <span>Delete</span>
                          <span className="mx-1 font-semibold">{`${row.original.name}`}</span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {isClassLevelLoading ? 'Loading...' : 'No Class Level Found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <When
        condition={classLevelResponse?.data?.length && !isClassLevelLoading}
      >
        <Pagination
          limit={limit.toString()}
          onPageChange={handleOnPageChange}
          pageSize={classLevelResponse?.limit || 0}
          totalRecords={classLevelResponse?.total || 0}
          disabled={isClassLevelLoading}
          onLimitChange={handleLimitChange}
        />
        <DeleteConfirmationModal
          open={showDeleteConfirmationModal}
          description={`Are you sure you want to delete "${selectedClassLevel?.name}"`}
          onDeleteClick={async () => {
            if (selectedClassLevel) {
              setShowDeleteConfirmationModal(false);
              await deleteClassLevelAsync(selectedClassLevel.id);
            }
          }}
          onCancelClick={() => {
            setShowDeleteConfirmationModal(false);
          }}
        />
      </When>
    </section>
  );
}
