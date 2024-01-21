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
import { cn } from 'utils';

import { DeleteConfirmationModal } from '../../../../../lib/components/modals/DeleteConfirmationModal';
import { GroupModel } from '../../../../../lib/domain/group';
import { useDeleteGroupMutationQuery } from '../../../../../lib/queries/group/useDeleteGroupMutationQuery';
import { useGetGroupListQuery } from '../../../../../lib/queries/group/useGetGroupListQuery';

const columns: ColumnDef<GroupModel>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Group Name
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

export function GroupListTable() {
  const { toast } = useToast();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupModel | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const status = true;

  const { data: groupListResponse, isLoading: isGroupListLoading } =
    useGetGroupListQuery({
      page,
      limit,
      status,
    });

  const {
    isError: isDeleteGroupError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteGroupAsync,
  } = useDeleteGroupMutationQuery(page, limit, status);

  useEffect(() => {
    if (isDeleteGroupError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting group',
      });
    }
  }, [isDeleteGroupError, toast]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Group deleted successfully',
      });
      setSelectedGroup(null);
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
    data: groupListResponse?.data || [],
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
                              setSelectedGroup(row.original);
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
                                className="text-center text-red-600"
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
                    {isGroupListLoading ? 'Loading...' : 'No Group Found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <When condition={groupListResponse?.data?.length && !isGroupListLoading}>
        <section className="mt-5 flex justify-between">
          <div className="justify-left flex w-2/6">
            <label className="w-1/3 py-2 text-center text-sm text-gray-700">
              Entries per page
            </label>
            <div className="w-1/3">
              <Select
                value={limit.toString()}
                disabled={isGroupListLoading}
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
            pageSize={groupListResponse?.limit || 0}
            totalRecords={groupListResponse?.total || 0}
          />
        </section>
        <DeleteConfirmationModal
          open={showDeleteConfirmationModal}
          description={`Are you sure you want to delete "${selectedGroup?.name}"`}
          onDeleteClick={async () => {
            if (selectedGroup) {
              setShowDeleteConfirmationModal(false);
              await deleteGroupAsync(selectedGroup.id);
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
