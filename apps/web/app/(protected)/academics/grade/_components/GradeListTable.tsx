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
import { useDeleteGradeScaleMutationQuery } from 'lib/queries/grade/useDeleteGradeScaleMutationQuery';
import { Loader2, Pencil, PlusCircleIcon, Trash2 } from 'lucide-react';
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

import { GradeModel, gradeScales } from '../../../../../lib/domain/grade';
import { useGetGradeList } from '../../../../../lib/queries/grade/useGetGradeListMutationQuery';

export function GradeListTable() {
  const { toast } = useToast();

  const [
    showScaleDeleteConfirmationModal,
    setShowScaleDeleteConfirmationModal,
  ] = useState(false);
  const [selectedGradeScale, setSelectedGradeScale] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const columns: ColumnDef<GradeModel>[] = [
    {
      accessorKey: 'name',
      header: () => {
        return (
          <Button variant="ghost" className="px-0">
            Grades
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="flex ">{row.original.name}</div>;
      },
    },
    {
      accessorKey: 'gradeScales',
      header: () => {
        return (
          <Button variant="ghost" className="px-0">
            Grade Scales
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="grid grid-cols-5 gap-2">
            {row.original.gradeScales.map((gradeScale: gradeScales, index) => (
              <div key={index}>
                <p className="mt-1 flex justify-between rounded-full bg-blue-100 px-1 py-1 text-center text-sm font-medium text-indigo-700">
                  <Button
                    className="flex h-auto w-full cursor-pointer justify-between gap-4"
                    variant="ghost"
                  >
                    <span>
                      {gradeScale.gradeName}
                      {' (' +
                        gradeScale.startValue +
                        ' to ' +
                        gradeScale.endValue +
                        ')'}
                    </span>
                    {isDeleteGradeScalePending &&
                    gradeScale?.id === selectedGradeScale?.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-red-600" />
                    ) : (
                      <Trash2
                        onClick={() => {
                          setSelectedGradeScale(gradeScale);
                          setShowScaleDeleteConfirmationModal(true);
                        }}
                        size={12}
                        className="text-center text-red-600 "
                      />
                    )}
                  </Button>
                </p>
              </div>
            ))}
            <div>
              <p className="mt-1 flex cursor-pointer justify-between rounded-full border-2 border-zinc-300 bg-gray-100 px-1 py-1 text-center text-sm font-medium text-indigo-700">
                <Button
                  className="flex h-auto justify-between gap-4"
                  variant="ghost"
                  onClick={async () => {
                    const params = new URLSearchParams(searchParams);
                    params.set('isGradeScaleFlyoutOpen', 'true');
                    params.set('gradeId', row.original.id);

                    router.replace(pathname + '?' + params.toString());
                  }}
                >
                  <span className="text-gray-600"> Add More</span>
                  <PlusCircleIcon
                    size={16}
                    className="text-center text-gray-600"
                  />
                </Button>
              </p>
            </div>
          </div>
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

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const { data: getGradeListResponse, isLoading: isGradeListLoading } =
    useGetGradeList({ page, limit });

  const table = useReactTable({
    columns,
    data: getGradeListResponse?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleOnPageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());

      router.push(pathname + '?' + params.toString());
    },
    [searchParams, pathname, router]
  );

  const {
    isError: isDeleteGradeScaleError,
    isSuccess: isDeleteGradeScaleSuccess,
    isPending: isDeleteGradeScalePending,
    mutateAsync: deleteGradeScaleAsync,
  } = useDeleteGradeScaleMutationQuery(page, limit);
  useEffect(() => {
    if (isDeleteGradeScaleError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting scale',
      });
    }
  }, [isDeleteGradeScaleError, toast]);

  useEffect(() => {
    if (isDeleteGradeScaleSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Scale deleted successfully',
      });
      setSelectedGradeScale(null);
    }
  }, [isDeleteGradeScaleSuccess, toast]);
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
                          className="mr-3 h-auto px-3 py-2"
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
                  {isGradeListLoading ? 'Loading...' : 'No Grade Found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <When
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
        <DeleteConfirmationModal
          open={showScaleDeleteConfirmationModal}
          description={`Are you sure you want to delete "${selectedGradeScale?.scaleName}"`}
          onDeleteClick={async () => {
            if (selectedGradeScale) {
              setShowScaleDeleteConfirmationModal(false);
              await deleteGradeScaleAsync(selectedGradeScale.id);
            }
          }}
          onCancelClick={() => {
            setShowScaleDeleteConfirmationModal(false);
          }}
        />
      </When>
    </section>
  );
}
