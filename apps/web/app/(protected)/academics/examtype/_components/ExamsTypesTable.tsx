'use client';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useGetExamTypeListQuery } from 'lib/queries/exams/useGetExamTypeListQuery';
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

import { ExamTypeModel } from '../../../../../lib/domain/exam';
import { useDeleteExamTypeMutationQuery } from '../../../../../lib/queries/examtype/useDeleteExamTypeMutationQuery';

const columns = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 "
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Exam Type Name
      </Button>
    ),
  },
  {
    accessorKey: 'frequencyId',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0 "
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Frequency
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

export function ExamTypeListTable() {
  const { toast } = useToast();
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedExamType, setSelectedExamType] =
    useState<ExamTypeModel | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const { data: examTypeList, isPending: isexamTypeLoading } =
    useGetExamTypeListQuery({
      page,
      limit,
    });
  const {
    isError: isDeleteExamTypeError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteExamTypeAsync,
  } = useDeleteExamTypeMutationQuery(page, limit);

  useEffect(() => {
    if (isDeleteExamTypeError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting medium',
      });
    }
  }, [isDeleteExamTypeError, toast]);
  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Exam Type deleted successfully',
      });
      setSelectedExamType(null);
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
    data: examTypeList?.data || [],
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
                          params.set('isExamTypeFlyoutOpen', 'true');
                          params.set('examTypeId', row.original.id);
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
                          setSelectedExamType(row.original);
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
                {isexamTypeLoading ? 'Loading...' : 'No Exam Type Found'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <When condition={examTypeList?.data?.length && !isexamTypeLoading}>
        <Pagination
          limit={limit.toString()}
          onPageChange={handleOnPageChange}
          pageSize={examTypeList?.limit || 0}
          totalRecords={examTypeList?.total || 0}
          disabled={isexamTypeLoading}
          onLimitChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.set('limit', value.toString());

            router.push(pathname + '?' + params.toString());
          }}
        />
        <DeleteConfirmationModal
          open={showDeleteConfirmationModal}
          description={`Are you sure you want to delete "${selectedExamType?.name}"`}
          onDeleteClick={async () => {
            if (selectedExamType) {
              setShowDeleteConfirmationModal(false);
              await deleteExamTypeAsync(selectedExamType.id);
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
