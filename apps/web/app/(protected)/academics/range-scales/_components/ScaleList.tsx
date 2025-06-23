'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { RangeScaleModel } from 'lib/domain/analytics/rangeAnalytics';
import { useDeleteRangeMutationQuery } from 'lib/queries/analytics/rangeScales/useDeleteRangeMutationQuery';
import { useGetRangeScalesQuery } from 'lib/queries/analytics/rangeScales/useGetRangeScalesQuery';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { When } from 'react-if';
import {
  Button,
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

import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

export function RangeScaleList() {
  const { toast } = useToast();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedRange, setSelectedRange] = useState<RangeScaleModel | null>(
    null
  );
  const [filterType, setFilterType] = useState('All');
  const columns: ColumnDef<RangeScaleModel>[] = [
    {
      accessorKey: 'index',
      header: () => {
        return (
          <Button variant="ghost" className="w-full">
            #
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{Number(row.index) + 1}</div>
      ),
    },
    {
      accessorKey: 'rangeOf',
      header: () => {
        return (
          <Button variant="ghost" className="px-0">
            Range Type
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="flex ">{row.original.rangeOf}</div>;
      },
    },
    {
      accessorKey: 'startValue',
      header: () => {
        return (
          <Button variant="ghost" className="px-0">
            Start Value
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="flex ">{row.original.startValue}</div>;
      },
    },
    {
      accessorKey: 'endValue',
      header: () => {
        return (
          <Button variant="ghost" className="px-0">
            End Value
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="flex">{row.original.endValue}</div>;
      },
    },
    {
      accessorKey: 'order',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Order
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.order}</span>;
      },
    },
  ];

  const {
    data: getRangeScaleListResponse,
    isLoading: isRangeScaleListLoading,
  } = useGetRangeScalesQuery({ rangeType: filterType });

  const table = useReactTable({
    columns,
    data: getRangeScaleListResponse || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const {
    isError: isDeleteRangeError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteRangeAsync,
  } = useDeleteRangeMutationQuery();

  useEffect(() => {
    if (isDeleteRangeError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting medium',
      });
    }
  }, [isDeleteRangeError, toast]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Medium deleted successfully',
      });
      setSelectedRange(null);
    }
  }, [isDeleteSuccess, toast]);

  return (
    <section>
      <div className="rounded-md ">
        <div className="p-2">
          <div className="mt-4">
            <label
              htmlFor="type"
              className="text-sm font-semibold text-gray-700"
            >
              Choose Range Type
            </label>
            <Select
              autoComplete="off"
              onValueChange={(value) => {
                if (value) {
                  setFilterType(value);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="SubjectMarks">SubjectMarks</SelectItem>
                  <SelectItem value="TotalMarks">TotalMarks</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
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
                          className="h-auto px-3 py-2"
                          variant="mild"
                          onClick={() => {
                            setSelectedRange(row.original);
                            setShowDeleteConfirmationModal(true);
                          }}
                        >
                          <Trash2
                            size={12}
                            className="text-center text-red-600 "
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          <span>Delete</span>
                          <span className="mx-1 font-semibold">{`${row.original.startValue} < ${row.original.endValue}`}</span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {isRangeScaleListLoading
                    ? 'Loading...'
                    : 'No RangeScale Found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <When
          condition={
            getRangeScaleListResponse?.length && !isRangeScaleListLoading
          }
        >
          <DeleteConfirmationModal
            open={showDeleteConfirmationModal}
            description={`Are you sure you want to delete "${selectedRange?.startValue} < ${selectedRange?.endValue}"`}
            onDeleteClick={async () => {
              if (selectedRange) {
                setShowDeleteConfirmationModal(false);
                await deleteRangeAsync(selectedRange.id);
              }
            }}
            onCancelClick={() => {
              setShowDeleteConfirmationModal(false);
            }}
          />
        </When>
      </div>
    </section>
  );
}
