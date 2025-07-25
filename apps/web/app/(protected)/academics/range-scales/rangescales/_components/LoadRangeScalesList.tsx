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
import { useAddRangeScaleMutationQuery } from 'lib/queries/analytics/rangeScales/useAddRangeScaleMutationQuery';
import { useDeleteRangeMutationQuery } from 'lib/queries/analytics/rangeScales/useDeleteRangeMutationQuery';
import { useGetRangeScalesQuery } from 'lib/queries/analytics/rangeScales/useGetRangeScalesQuery';
import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { ChevronDown, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { When } from 'react-if';
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
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

import { PageTitle } from '@/components/PageTitle';

const LoadRangeScalesList = () => {
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState('');
  const [selectedRange, setSelectedRange] = useState<RangeScaleModel | null>(
    null
  );
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const { toast } = useToast();

  const { data: allBatchesList } = useGetBatchesListQuery({
    page: 1,
    limit: 100,
    filter: { isActive: true },
  });
  useEffect(() => {
    if (
      allBatchesList?.data?.length &&
      (!selectedAcademicYearId ||
        !allBatchesList.data.find((b) => b.id === selectedAcademicYearId))
    ) {
      setSelectedAcademicYearId(allBatchesList.data[0].id);
    }
  }, [allBatchesList]);

  const {
    data: getRangeScaleListResponse,
    isLoading: isRangeScaleListLoading,
  } = useGetRangeScalesQuery(
    {
      rangeType: 'All',
      academicYearId: selectedAcademicYearId,
    },
    {
      enabled: !!selectedAcademicYearId,
    }
  );

  const { isError: isDeleteRangeError, isSuccess: isDeleteSuccess } =
    useDeleteRangeMutationQuery();

  const { mutateAsync: mutateAddRangeScaleAsync } =
    useAddRangeScaleMutationQuery();

  async function saveNewRange() {
    stableRangeScaleData;
    // if (selectedRange) {
    //   const newRange = {
    //     ...selectedRange,
    //     rangeOf: selectedRange.rangeOf,
    //     startValue: selectedRange.startValue,
    //     endValue: selectedRange.endValue,
    //     order: selectedRange.order,
    //   };
    //   mutateAddRangeScaleAsync(newRange);
    // }

    try {
      const requestPayload = stableRangeScaleData.map((field) => ({
        startValue: field.startValue,
        endValue: field.endValue,
        order: Number(field.order) as number,
        rangeOf: field.rangeOf,
        classLevelId: field.classLevelId,
      }));
      await mutateAddRangeScaleAsync(requestPayload);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (isDeleteRangeError) {
      toast({
        title: 'Error',
        description: 'Error while deleting range scale',
      });
    }
  }, [isDeleteRangeError]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Deleted',
        description: 'Range scale deleted successfully',
      });
      setSelectedRange(null);
    }
  }, [isDeleteSuccess]);

  const columns: ColumnDef<RangeScaleModel>[] = [
    {
      accessorKey: 'index',
      header: () => <Button variant="ghost">#</Button>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: 'rangeOf',
      header: () => <Button variant="ghost">Range Type</Button>,
      cell: ({ row }) => <div>{row.original.rangeOf}</div>,
    },
    {
      accessorKey: 'startValue',
      header: () => <Button variant="ghost">Start Value</Button>,
      cell: ({ row }) => <div>{row.original.startValue}</div>,
    },
    {
      accessorKey: 'endValue',
      header: () => <Button variant="ghost">End Value</Button>,
      cell: ({ row }) => <div>{row.original.endValue}</div>,
    },
    {
      accessorKey: 'order',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Order
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.order}</span>,
    },
  ];
  const stableRangeScaleData = useMemo(() => {
    return getRangeScaleListResponse || [];
  }, [getRangeScaleListResponse]);

  const table = useReactTable({
    columns,
    data: stableRangeScaleData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <section className="space-y-4 p-2">
      <div className="flex items-end justify-between">
        <PageTitle title="Copy Range Scales" />
        <div className="grid grid-cols-2 items-center gap-2">
          <Text>Select AcademicYear</Text>
          {showDeleteConfirmationModal && ''}
          <Select
            value={selectedAcademicYearId}
            onValueChange={(val) => setSelectedAcademicYearId(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Academic Year" />
              <ChevronDown />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {allBatchesList?.data?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isRangeScaleListLoading ? (
        <div className="py-10 text-center">Loading range scales...</div>
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="px-3 py-2"
                          variant="mild"
                          onClick={() => {
                            setSelectedRange(row.original);
                            setShowDeleteConfirmationModal(true);
                          }}
                        >
                          <Trash2 size={12} className="text-red-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Delete{' '}
                        <b>
                          {row.original.startValue} &lt; {row.original.endValue}
                        </b>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No RangeScale Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedRange(null);
          }}
        >
          Clear
        </Button>
        <Button
          variant="default"
          onClick={() => {
            saveNewRange();
          }}
        >
          Save
        </Button>
      </div>

      <When condition={!!selectedRange}>
        {/* <DeleteConfirmationModal
          open={showDeleteConfirmationModal}
          description={`Are you sure you want to delete "${selectedRange?.startValue} < ${selectedRange?.endValue}"?`}
          onDeleteClick={async () => {
            if (selectedRange) {
              setShowDeleteConfirmationModal(false);
              await deleteRangeAsync(selectedRange.id);
            }
          }}
          onCancelClick={() => setShowDeleteConfirmationModal(false)}
        /> */}
      </When>
    </section>
  );
};

export default LoadRangeScalesList;
