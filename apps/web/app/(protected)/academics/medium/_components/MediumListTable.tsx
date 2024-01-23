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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

import { DeleteConfirmationModal } from '../../../../../lib/components/modals/DeleteConfirmationModal';
import { MediumModel } from '../../../../../lib/domain/medium';
import { useDeleteMediumMutationQuery } from '../../../../../lib/queries/medium/useDeleteMediumMutationQuery';
import { useGetMediumListQuery } from '../../../../../lib/queries/medium/useGetMediumListQuery';

const columns: ColumnDef<MediumModel>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Medium Name
        </Button>
      );
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Description
        </Button>
      );
    },
    cell: ({ row }) => {
      let description: string = row.getValue('description');
      return <div>{description || 'N/A'}</div>;
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
      return <div>{row.original.isActive ? 'true' : 'false'}</div>;
    },
  },
];

export function MediumListTable() {
  const { toast } = useToast();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedMedium, setSelectedMedium] = useState<MediumModel | null>(
    null
  );

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const { data: mediumListResponse, isLoading: isMediumListLoading } =
    useGetMediumListQuery({
      page,
      limit,
    });

  const {
    isError: isDeleteMediumError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteMediumAsync,
  } = useDeleteMediumMutationQuery(page, limit);

  useEffect(() => {
    if (isDeleteMediumError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting medium',
      });
    }
  }, [isDeleteMediumError, toast]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Medium deleted successfully',
      });
      setSelectedMedium(null);
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
    data: mediumListResponse?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <section>
      <div>
        <div>
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
                              params.set('isMediumFlyoutOpen', 'true');
                              params.set('mediumId', row.original.id);
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
                              setSelectedMedium(row.original);
                              setShowDeleteConfirmationModal(true);
                            }}
                            disabled={
                              row.original.isNewlyAdded ||
                              row.original.isUpdating
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
                    {isMediumListLoading ? 'Loading...' : 'No Medium Found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <When
        condition={mediumListResponse?.data?.length && !isMediumListLoading}
      >
        <section className="mt-5 flex justify-between">
          <div className="justify-left flex w-2/6">
            <label className="w-1/3 py-2 text-center text-sm text-gray-700">
              Entries per page
            </label>
            <div className="w-1/3">
              <Select
                value={limit.toString()}
                disabled={isMediumListLoading}
                onValueChange={(value) => {
                  const params = new URLSearchParams(searchParams);
                  params.set('limit', value.toString());
                  router.push(pathname + '?' + params.toString());
                }}
              >
                <SelectTrigger className="w-auto">
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
            onPageChange={handleOnPageChange}
            pageSize={mediumListResponse?.limit || 0}
            totalRecords={mediumListResponse?.total || 0}
          />
        </section>
        <DeleteConfirmationModal
          open={showDeleteConfirmationModal}
          description={`Are you sure you want to delete "${selectedMedium?.name}"`}
          onDeleteClick={async () => {
            if (selectedMedium) {
              setShowDeleteConfirmationModal(false);
              await deleteMediumAsync(selectedMedium.id);
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
