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
import { useCallback, useEffect, useState } from 'react';
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

import { DeleteConfirmationModal } from '../../../../../lib/components/modals/DeleteConfirmationModal';
import {
  SubjectFormatModel,
  SubjectModel,
  SubjectTypeModel,
} from '../../../../../lib/domain/subject';
import { useDeleteSubjectMutationQuery } from '../../../../../lib/queries/subjects/useDeleteSubjectMutationQuery';
import { useGetSubjectListQuery } from '../../../../../lib/queries/subjects/useGetSubjectListQuery';

const columns: ColumnDef<SubjectModel>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Subject Name
        </Button>
      );
    },
  },
  {
    accessorKey: 'SubjectType',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Subject Type
        </Button>
      );
    },
    cell: ({ row }) => {
      const subjectType = row.getValue('SubjectType');
      if (!subjectType) {
        return <div>N/A</div>;
      } else {
        return <div>{(subjectType as SubjectTypeModel).name}</div>;
      }
    },
  },
  {
    accessorKey: 'SubjectFormat',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Subject Format
        </Button>
      );
    },
    cell: ({ row }) => {
      const subjectFormat = row.getValue('SubjectFormat');
      if (!subjectFormat) {
        return <div>N/A</div>;
      } else {
        return <div>{(subjectFormat as SubjectFormatModel).name}</div>;
      }
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
export function SubjectsListTable() {
  const { toast } = useToast();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectModel | null>(
    null
  );

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const { data: subjectListResponse, isLoading: isSubjectListLoading } =
    useGetSubjectListQuery({
      page,
      limit,
    });

  const {
    isError: isDeleteSubjectError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteSubjectAsync,
  } = useDeleteSubjectMutationQuery(page, limit);

  const handleOnPageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());

      router.push(pathname + '?' + params.toString());
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    if (isDeleteSubjectError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting subject',
      });
    }
  }, [isDeleteSubjectError, toast]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Subject deleted successfully',
      });
      setSelectedSubject(null);
    }
  }, [isDeleteSuccess, toast]);

  const table = useReactTable({
    columns,
    data: subjectListResponse?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
                  onMouseEnter={async () => {
                    row.original.id;
                  }}
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
                          onClick={async () => {
                            const params = new URLSearchParams(searchParams);
                            params.set('isFlyoutOpen', 'true');
                            params.set('subjectId', row.original.id);

                            router.replace(pathname + '?' + params.toString());
                          }}
                          className="mr-3 h-auto px-3 py-2"
                          variant="mild"
                          disabled={
                            row.original.isNewlyAdded || row.original.isUpdating
                          }
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
                    <Tooltip></Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="h-auto px-3 py-2"
                          variant="mild"
                          onClick={() => {
                            setSelectedSubject(row.original);
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
                  {isSubjectListLoading ? 'Loading...' : 'No Subject Found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <When
        condition={subjectListResponse?.data?.length && !isSubjectListLoading}
      >
        <Pagination
          value={limit.toString()}
          onPageChange={handleOnPageChange}
          pageSize={subjectListResponse?.limit || 0}
          totalRecords={subjectListResponse?.total || 0}
          disabled={isSubjectListLoading}
          onValueChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.set('limit', value.toString());

            router.replace(pathname + '?' + params.toString());
          }}
        />
        <DeleteConfirmationModal
          open={showDeleteConfirmationModal}
          description={`Are you sure you want to delete "${selectedSubject?.name}"`}
          onDeleteClick={async () => {
            if (selectedSubject) {
              setShowDeleteConfirmationModal(false);
              await deleteSubjectAsync(selectedSubject.id);
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
