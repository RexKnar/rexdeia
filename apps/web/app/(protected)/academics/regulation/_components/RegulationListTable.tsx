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

import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

import { RegulationModel } from '../../../../../lib/domain/regulation';
import { useDeleteRegulationMutationQuery } from '../../../../../lib/queries/regulations/useDeleteRegulationMutationQuery';
import { useGetRegulationListQuery } from '../../../../../lib/queries/regulations/useGetRegulationListQuery';

const columns: ColumnDef<RegulationModel>[] = [
  {
    accessorKey: 'regulationName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
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
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Announced Year
        </Button>
      );
    },
    cell: ({ row }) => {
      let responseDate: string = row.getValue('announcedYear');
      let date = new Date(responseDate);
      return <div>{date.toDateString()}</div>;
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-1"
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

export function RegulationListTable() {
  const { toast } = useToast();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedRegulation, setSelectedRegulation] =
    useState<RegulationModel | null>(null);

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const {
    isError: isDeleteRegulationError,
    isSuccess: isDeleteRegulationSuccess,
    mutateAsync: deleteRegulationMutateAsync,
  } = useDeleteRegulationMutationQuery(page, limit);

  const { data: regulationListResponse, isLoading: isRegulationListLoading } =
    useGetRegulationListQuery({
      page,
      limit,
    });

  useEffect(() => {
    if (isDeleteRegulationError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting regulation',
      });
    }
  }, [isDeleteRegulationError, toast]);

  useEffect(() => {
    if (isDeleteRegulationSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Regulation deleted successfully',
      });
      setSelectedRegulation(null);
    }
  }, [isDeleteRegulationSuccess, toast]);

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
    data: regulationListResponse?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section>
      <div className="overflow-hidden">
        <div className="max-h-screen overflow-y-auto">
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
                    <TableCell className="w-52">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => {
                              const params = new URLSearchParams(searchParams);
                              params.set('isFlyoutOpen', 'true');
                              params.set('regulationId', row.original.id);
                              router.push(pathname + '?' + params.toString());
                            }}
                            className="mr-2 h-auto px-3 py-2"
                            variant="mild"
                            disabled={row.original.isNewlyAdded}
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
                            <span className="mx-1 font-semibold">{`${row.original.regulationName}`}</span>
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="h-auto px-3 py-2"
                            variant="mild"
                            onClick={() => {
                              setSelectedRegulation(row.original);
                              setShowDeleteConfirmationModal(true);
                            }}
                            disabled={row.original.isNewlyAdded}
                          >
                            {row.original.isDeleting ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2
                                size={12}
                                className="text-center text-red-600"
                              />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            <span>Delete</span>
                            <span className="mx-1 font-semibold">{`${row.original.regulationName}`}</span>
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {isRegulationListLoading
                      ? 'Loading...'
                      : 'No Regulation Found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <When
        condition={
          regulationListResponse?.data?.length && !isRegulationListLoading
        }
      >
        <Pagination
          limit={limit.toString()}
          disabled={isRegulationListLoading}
          onPageChange={handleOnPageChange}
          pageSize={regulationListResponse?.limit || 0}
          totalRecords={regulationListResponse?.total || 0}
          onLimitChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.set('limit', value.toString());

            router.push(pathname + '?' + params.toString());
          }}
        />
        <DeleteConfirmationModal
          open={showDeleteConfirmationModal}
          description={`Are you sure you want to delete "${selectedRegulation?.regulationName}"`}
          onDeleteClick={async () => {
            if (selectedRegulation) {
              setShowDeleteConfirmationModal(false);
              await deleteRegulationMutateAsync(selectedRegulation.id);
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
