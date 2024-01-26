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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
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

import { DeleteConfirmationModal } from '../../../../../lib/components/modals/DeleteConfirmationModal';
import { BatchModel } from '../../../../../lib/domain/batch';
import { useDeleteBatchMutationQuery } from '../../../../../lib/queries/batches/useDeleteBatchMutationQuery';
import { usePrefetchBatch } from '../../../../../lib/queries/batches/useGetBatchByIdQuery';
import { useGetBatchesListQuery } from '../../../../../lib/queries/batches/useGetBatchesListQuery';

const columns: ColumnDef<BatchModel>[] = [
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

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchModel | null>(null);

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

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
    });

  const handleOnPageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());

      router.replace(pathname + '?' + params.toString());
    },
    [searchParams, pathname, router]
  );

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
        description: 'Batch deleted successfully',
      });
      setSelectedBatch(null);
    }
  }, [isDeleteSuccess, toast]);

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
                          onClick={async () => {
                            const params = new URLSearchParams(searchParams);
                            params.set('isFlyoutOpen', 'true');
                            params.set('batchId', row.original.id);

                            router.replace(pathname + '?' + params.toString());
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
                  {isBatchesListLoading ? 'Loading...' : 'No Batches Found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <When condition={batchesList?.data?.length && !isBatchesListLoading}>
        <Pagination
          value={limit.toString()}
          onPageChange={handleOnPageChange}
          pageSize={batchesList?.limit || 0}
          totalRecords={batchesList?.total || 0}
          disabled={isBatchesListLoading}
          onValueChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.set('limit', value.toString());

            router.replace(pathname + '?' + params.toString());
          }}
        />
        <DeleteConfirmationModal
          open={showDeleteConfirmationModal}
          description={`Are you sure you want to delete "${selectedBatch?.name}"`}
          onDeleteClick={async () => {
            if (selectedBatch) {
              setShowDeleteConfirmationModal(false);
              await deleteBatchAsync(selectedBatch.id);
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
