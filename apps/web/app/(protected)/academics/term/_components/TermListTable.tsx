'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TermModel } from 'lib/domain/exam';
import { useGetTermsListQuery } from 'lib/queries/exams/useGetTermListQuery';
import { useDeleteTermMutationQuery } from 'lib/queries/term/useDeleteTermMutationQuery';
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

import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

const columns = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 "
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Term Name
      </Button>
    ),
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 "
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
      </Button>
    ),
    cell: ({ row }) => (
      <span
        className={`ml-1 rounded px-2 py-1 text-center text-sm font-medium text-gray-100
       ${row.original.isActive ? 'bg-green-600' : 'bg-red-600'}`}
      >
        {row.original.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

export function TermListTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { toast } = useToast();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

  const [selectedTerm, setSelectedTerm] = useState<TermModel | null>(null);

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const { data: termList, isPending: istermLoading } = useGetTermsListQuery({
    page,
    limit,
  });

  const {
    isError: isDeleteTermError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteTermAsync,
  } = useDeleteTermMutationQuery(page, limit);

  useEffect(() => {
    if (isDeleteTermError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting term',
      });
    }
  }, [isDeleteTermError, toast]);
  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Term deleted successfully',
      });
      setSelectedTerm(null);
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
    data: termList?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <section>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell className="w-52">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => {
                          const params = new URLSearchParams();
                          params.set('isTermFlyoutOpen', 'true');
                          params.set('termId', row.original.id);
                          router.push(pathname + '?' + params.toString());
                        }}
                        className="mr-2 h-auto px-3 py-2"
                        variant="mild"
                      >
                        <Pencil size={12} className="text-center text-black" />
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
                          setSelectedTerm(row.original);
                          setShowDeleteConfirmationModal(true);
                        }}
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
                {istermLoading ? 'Loading...' : 'No Term Found'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <When condition={termList?.data?.length && !istermLoading}>
        <Pagination
          limit={limit.toString()}
          onPageChange={handleOnPageChange}
          pageSize={termList?.limit || 0}
          totalRecords={termList?.total || 0}
          disabled={istermLoading}
          onLimitChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.set('limit', value.toString());

            router.push(pathname + '?' + params.toString());
          }}
        />
        <DeleteConfirmationModal
          open={showDeleteConfirmationModal}
          description={`Are you sure you want to delete "${selectedTerm?.name}"`}
          onDeleteClick={async () => {
            if (selectedTerm) {
              setShowDeleteConfirmationModal(false);
              await deleteTermAsync(selectedTerm.id);
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
