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
import { Eye, Loader2, Pencil, Trash2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { When } from 'react-if';
import {
  Button,
  Pagination,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import { RegulationModel } from '../../../../../lib/domain/regulation';
import { useDeleteRegulationMutationQuery } from '../../../../../lib/queries/regulations/useDeleteRegulationMutationQuery';
import { useGetRegulationListQuery } from '../../../../../lib/queries/regulations/useGetRegulationListQuery';

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'regulationName',
    header: ({ column }) => {
      return (
        <Button
          className="text-lg font-semibold"
          variant="ghost"
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
          className="text-lg font-semibold"
          variant="ghost"
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
          className="text-lg font-semibold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.isActive ? 'true' : 'false'}</div>;
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

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const {
    mutateAsync: deleteRegulationMutateAsync,
    isSuccess: isDeleteRegulationSuccess,
  } = useDeleteRegulationMutationQuery(parseInt(page) || 1);

  const { data: regulationListResponse, isLoading: isRegulationListLoading } =
    useGetRegulationListQuery({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });

  useEffect(() => {
    if (isDeleteRegulationSuccess) {
      toast({
        title: 'Success',
        variant: 'destructive',
        description: 'Regulation deleted successfully',
      });
    }
  }, [isDeleteRegulationSuccess]);

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
      <div className="rounded-md ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="cursor-pointer hover:bg-white"
              >
                <TableHead className="ms-2 cursor-pointer ps-6 text-lg font-semibold">
                  S.no
                </TableHead>
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
                <TableHead className="ms-1 cursor-pointer ps-6 text-lg">
                  Actions
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'cursor-pointer',
                    index % 2 !== 0 && 'cursor-pointer'
                  )}
                >
                  <TableCell className="ps-6">{index + 1}</TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="w-52">
                    <Button
                      variant="destructive"
                      disabled={row.original.isNewlyAdded}
                    >
                      <Eye
                        size={16}
                        className="mr-2 text-center text-primary"
                      />
                    </Button>
                    <Button
                      variant="destructive"
                      className="mr-1"
                      disabled={row.original.isNewlyAdded}
                    >
                      <Pencil
                        size={16}
                        className="mr-2 text-center text-black"
                      />
                    </Button>
                    <Button
                      variant="destructive"
                      className="mr-1"
                      onClick={() => {
                        setSelectedRegulation(row.original);
                        setShowDeleteConfirmationModal(true);
                      }}
                      disabled={row.original.isNewlyAdded}
                    >
                      {row.original.isDeleting ? (
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-red-600" />
                      ) : (
                        <Trash2
                          size={16}
                          className="mr-2 text-center text-red-600"
                        />
                      )}
                    </Button>
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

      <When
        condition={
          regulationListResponse?.data?.length && !isRegulationListLoading
        }
      >
        <section className="mt-5 flex justify-between">
          <div className="justify-left flex w-2/6">
            <label className="w-1/3 py-2 text-center text-sm text-gray-700">
              Entries per page
            </label>
            <div className="w-1/3">
              <Select
                value={limit || '10'}
                disabled={isRegulationListLoading}
                onValueChange={(value) => {
                  const params = new URLSearchParams(searchParams);
                  params.set('limit', value.toString());

                  router.push(pathname + '?' + params.toString());
                }}
              >
                <SelectTrigger className="w-auto ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={'10'}>10</SelectItem>
                    <SelectItem value={'25'}>25</SelectItem>
                    <SelectItem value={'50'}>50</SelectItem>
                    <SelectItem value={'100'}>100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Pagination
            pageSize={regulationListResponse?.limit || 0}
            totalRecords={regulationListResponse?.total || 0}
            onPageChange={(value) => {
              const params = new URLSearchParams(searchParams);
              params.set('page', value.toString());

              router.push(pathname + '?' + params.toString());
            }}
          />
        </section>
      </When>
    </section>
  );
}
