'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { RangeScaleModel } from 'lib/domain/analytics/rangeAnalytics';
import { useDeleteRangeMutationQuery } from 'lib/queries/analytics/rangeScales/useDeleteRangeMutationQuery';
import { useGetRangeScalesQuery } from 'lib/queries/analytics/rangeScales/useGetRangeScalesQuery';
import { useGetClassLevelListQuery } from 'lib/queries/classLevel/useGetClassLevelsListQuery';
import { Loader2, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { When } from 'react-if';
import {
  Badge,
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
  const [filterClassLevel, setFilterClassLevel] = useState('All');

  const classLevelQueryParams = useMemo(() => ({ page: 1, limit: 999 }), []);
  const { data: classLevelListResponse } = useGetClassLevelListQuery(
    classLevelQueryParams
  );

  const rangeScaleFilter = useMemo(
    () => ({
      rangeType: filterType,
      classLevelId: filterClassLevel,
    }),
    [filterType, filterClassLevel]
  );

  const {
    data: getRangeScaleListResponse,
    isLoading: isRangeScaleListLoading,
    isError: isRangeScaleListError,
    refetch: refetchRangeScales,
  } = useGetRangeScalesQuery(rangeScaleFilter);

  const tableData = useMemo(
    () => getRangeScaleListResponse ?? [],
    [getRangeScaleListResponse]
  );

  const columns: ColumnDef<RangeScaleModel>[] = useMemo(
    () => [
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
          return <div className="flex font-medium">{row.original.rangeOf}</div>;
        },
      },
      {
        id: 'classLevel',
        accessorFn: (row) => row.classLevel?.name ?? 'All / Common',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="px-0"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Class Level
            </Button>
          );
        },
        cell: ({ row }) => {
          const levelName = row.original.classLevel?.name;
          if (levelName) {
            return (
              <Badge
                variant="outline"
                className="border-gray-300 font-normal text-gray-700"
              >
                {levelName}
              </Badge>
            );
          }
          return (
            <Badge className="border-none bg-blue-100 font-medium text-blue-800 hover:bg-blue-100">
              All / Common
            </Badge>
          );
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
          return <div className="flex">{row.original.startValue}</div>;
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Order
            </Button>
          );
        },
        cell: ({ row }) => {
          return <span>{row.original.order}</span>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
        variant: 'destructive',
        description: 'Error while deleting range scale',
      });
    }
  }, [isDeleteRangeError, toast]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Range scale deleted successfully',
      });
      setSelectedRange(null);
    }
  }, [isDeleteSuccess, toast]);

  return (
    <section>
      <div className="rounded-md">
        <div className="p-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="range-type-filter"
                className="text-sm font-semibold text-gray-700"
              >
                Range Scale Type
              </label>
              <Select
                value={filterType}
                onValueChange={(value) => {
                  if (value) {
                    setFilterType(value);
                  }
                }}
              >
                <SelectTrigger id="range-type-filter" className="mt-1 w-full">
                  <SelectValue placeholder="Select Range Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All">All Range Types</SelectItem>
                    <SelectItem value="SubjectMarks">SubjectMarks</SelectItem>
                    <SelectItem value="TotalMarks">TotalMarks</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="class-level-filter"
                className="text-sm font-semibold text-gray-700"
              >
                Class Level
              </label>
              <Select
                value={filterClassLevel}
                onValueChange={(value) => {
                  if (value) {
                    setFilterClassLevel(value);
                  }
                }}
              >
                <SelectTrigger id="class-level-filter" className="mt-1 w-full">
                  <SelectValue placeholder="Select Class Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All">All Class Levels</SelectItem>
                    <SelectItem value="common">
                      Common / All (Global)
                    </SelectItem>
                    {classLevelListResponse?.map((classLevel) => (
                      <SelectItem key={classLevel.id} value={classLevel.id}>
                        {classLevel.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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
                <TableCell colSpan={7} className="h-24 text-center">
                  {isRangeScaleListLoading ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span>Loading range scales...</span>
                    </div>
                  ) : isRangeScaleListError ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <span className="font-semibold text-red-600">
                        Failed to load range scales
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => refetchRangeScales()}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <span className="font-semibold text-gray-700">
                        No Data Available
                      </span>
                      <span className="mt-1 text-xs text-gray-400">
                        No range scales found for the selected filters.
                      </span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <When
          condition={
            (getRangeScaleListResponse?.length ?? 0) > 0 &&
            !isRangeScaleListLoading
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
