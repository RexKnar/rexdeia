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

import { AssessmentFormatModel } from '../../../../../../lib/domain/subject';
import { useDeleteAssessmentFormatMutationQuery } from '../../../../../../lib/queries/assessment-format/useDeleteAssessmentFormatMutationQuery';
import { useGetAssessmentFormatList } from '../../../../../../lib/queries/assessment-format/useGetAssessmentFormatList';

const columns: ColumnDef<AssessmentFormatModel>[] = [
  {
    accessorKey: 'parentAssessmentFormat.name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Parent Name
        </Button>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Format Name
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
  {
    accessorKey: 'hasMarkEntry',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Has Mark Entry
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span
          className={cn(
            'ml-1 rounded px-2 py-1 text-center text-sm font-medium text-white',
            row.original.hasMarkEntry ? 'bg-green-500' : 'bg-red-500'
          )}
        >
          {row.original.hasMarkEntry ? 'Yes' : 'No'}
        </span>
      );
    },
  },
];

export function AssessmentFormatListTable() {
  const { toast } = useToast();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedAssessmentFormat, setSelectedAssessmentFormat] =
    useState<AssessmentFormatModel | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const {
    data: assessmentFormatListResponse,
    isLoading: isAssessmentFormatListLoading,
  } = useGetAssessmentFormatList({
    page,
    limit,
  });

  const {
    isError: isDeleteAssessmentFormatError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteAssessmentFormatAsync,
  } = useDeleteAssessmentFormatMutationQuery(page, limit);

  useEffect(() => {
    if (isDeleteAssessmentFormatError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting subject format',
      });
    }
  }, [isDeleteAssessmentFormatError, toast]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Subject Format deleted successfully',
      });
      setSelectedAssessmentFormat(null);
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

  const table = useReactTable({
    columns,
    data: assessmentFormatListResponse?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <section>
      <div className="rounded-md">
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
                            params.set('isAssessmentFormatFlyoutOpen', 'true');
                            params.set('assessmentFormatId', row.original.id);
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
                            setSelectedAssessmentFormat(row.original);
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
                  {isAssessmentFormatListLoading
                    ? 'Loading...'
                    : 'No Subject Format Found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <When
        condition={
          assessmentFormatListResponse?.data?.length &&
          !isAssessmentFormatListLoading
        }
      >
        <Pagination
          limit={limit.toString()}
          onPageChange={handleOnPageChange}
          pageSize={assessmentFormatListResponse?.limit || 0}
          totalRecords={assessmentFormatListResponse?.total || 0}
          disabled={isAssessmentFormatListLoading}
          onLimitChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.set('limit', value.toString());

            router.push(pathname + '?' + params.toString());
          }}
        />
        <DeleteConfirmationModal
          open={showDeleteConfirmationModal}
          description={`Are you sure you want to delete "${selectedAssessmentFormat?.name}"`}
          onDeleteClick={async () => {
            if (selectedAssessmentFormat) {
              setShowDeleteConfirmationModal(false);
              await deleteAssessmentFormatAsync(selectedAssessmentFormat.id);
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
