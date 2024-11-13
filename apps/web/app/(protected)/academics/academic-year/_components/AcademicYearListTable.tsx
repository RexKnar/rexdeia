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
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
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
import { useQueryParams } from '@/hooks/useQueryParams';

import { BatchModel } from '../../../../../lib/domain/batch';
import { useDeleteBatchMutationQuery } from '../../../../../lib/queries/batches/useDeleteBatchMutationQuery';
import { usePrefetchBatch } from '../../../../../lib/queries/batches/useGetBatchByIdQuery';
import { useGetBatchesListQuery } from '../../../../../lib/queries/batches/useGetBatchesListQuery';

const columns: ColumnDef[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Academic Name
        </Button>
      );
    },
  },
  {
    accessorKey: 'startYear',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Start Year
        </Button>
      );
    },
  },
  {
    accessorKey: 'endYear',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          End Year
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
            row.original.isActive ? 'bg-green-600' : 'bg-red-600'
          )}
        >
          {row.original.isActive ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
];

export function AcademicYearListTable() {
  const { toast } = useToast();

  const { getParam, setParams } = useQueryParams();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchModel | null>(null);

  const page = parseInt(getParam('page')) || 1;
  const limit = parseInt(getParam('limit')) || 10;
  const filter = {};

  const {
    isError: isDeleteBatchError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteBatchAsync,
  } = useDeleteBatchMutationQuery(page, limit);

  const { prefetchBatchById } = usePrefetchBatch();

  const { data: batchesList, isLoading: isBatchesListLoading } =
    useGetBatchesListQuery({
      page,
      limit,
      filter,
    });

  useEffect(() => {
    if (isDeleteBatchError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting batch',
      });
    }
  }, [isDeleteBatchError, toast]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Academic Year deleted successfully',
      });
      setSelectedBatch(null);
    }
  }, [isDeleteSuccess, toast]);

  const handleOnPageChange = useCallback(
    (page: number) => {
      setParams({ page: page.toString() });
    },
    [setParams]
  );

  const handleOnLimitChange = useCallback(
    (limit: number) => {
      setParams({ limit: limit.toString() });
    },
    [setParams]
  );

  const table = useReactTable({
    columns,
    data: batchesList?.data || [],
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
                  onMouseEnter={async () => {
                    await prefetchBatchById(row.original.id);
                  }}
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
                            setParams({
                              isFlyoutOpen: 'true',
                              batchId: row.original.id,
                            });
                          }}
                          className="mr-3 h-auto px-3 py-2"
                          variant="mild"
                          disabled={
                            row.original.isNewlyAdded || row.original.isUpdating
                          }
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
                          <span className="mx-1 font-semibold">{`${row.original.name}`}</span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="h-auto px-3 py-2"
                          variant="mild"
                          onClick={() => {
                            setSelectedBatch(row.original);
                            setShowDeleteConfirmationModal(true);
                          }}
                          disabled={
                            row.original.isNewlyAdded || row.original.isUpdating
                          }
                        >
                          {row.original.isDeleting ? (
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
                  {isBatchesListLoading
                    ? 'Loading...'
                    : 'No Academic Year Found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isBatchesListLoading &&
        batchesList.total > limit &&
        !batchesList?.data?.length && (
          <Pagination
            limit={limit.toString()}
            disabled={isBatchesListLoading}
            onPageChange={handleOnPageChange}
            pageSize={batchesList?.limit || 0}
            onLimitChange={handleOnLimitChange}
            totalRecords={batchesList?.total || 0}
          />
        )}

      <DeleteConfirmationModal
        open={showDeleteConfirmationModal}
        description={`Are you sure you want to delete "${selectedBatch?.name}"`}
        onDeleteClick={async () => {
          if (selectedBatch) {
            await deleteBatchAsync(selectedBatch.id);
            setShowDeleteConfirmationModal(false);
          }
        }}
        onCancelClick={() => {
          setShowDeleteConfirmationModal(false);
        }}
      />
    </section>
  );
}
