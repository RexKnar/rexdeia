'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  CreditCardIcon,
  Eye,
  Gem,
  HeartPulse,
  Loader2,
  MailPlusIcon,
  Pencil,
  PhoneCallIcon,
  Trash2,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { When } from 'react-if';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Pagination,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';
import { titilize } from 'utils';

import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

import { Student } from '../../../../../lib/domain';
import { useDeleteStudentMutationQuery } from '../../../../../lib/queries/students/useDeleteStudentMutationQuery';
import { useGetStudentListQuery } from '../../../../../lib/queries/useGetStudentListQuery';

export function StudentsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'firstName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="ml-3 px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Student
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-start">
            <div className="p-2">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
                <AvatarFallback className="bg-red-300">
                  {row.original.firstName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <p className="text-primary">
                {row.original.firstName} {row.original.middleName}{' '}
                {row.original.lastName}
              </p>
              <div className="flex items-center">
                <CreditCardIcon size={16} className="mr-1 text-green-800" />
                <p className="text-sm text-gray-900">
                  {titilize(row.original.aadharCardNumber)}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center">
                  <Gem size={12} className="mr-1 text-amber-700" />
                  <p className="text-sm text-gray-900">
                    {titilize(row.original.gender)}
                  </p>
                </div>
                <div className="flex items-center">
                  <HeartPulse className="mr-1 text-red-600" size={12} />
                  <p className="text-sm text-gray-800">
                    {row.original.bloodGroup}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center">
                  <MailPlusIcon className="mr-1 text-cyan-500" size={12} />
                  <p className="text-sm text-gray-800">
                    {row.original.emailId}
                  </p>
                </div>
                <div className="flex items-center">
                  <PhoneCallIcon className="mr-1 text-red-600" size={12} />
                  <p className="text-sm text-gray-800">
                    {row.original.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'emailId',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Permanent Address
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            <p className="text-sm text-gray-800">
              {row.original.additionalAttributes.permanentAddress}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.additionalAttributes.permanentCity}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.additionalAttributes.permanentState}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.additionalAttributes.permanentCountry}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.additionalAttributes.permanentPostalCode}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'emailId',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Residential Address
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            <p className="text-sm text-gray-800">
              {row.original.additionalAttributes.residentialAddress}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.additionalAttributes.residentialCity}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.additionalAttributes.residentialState}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.additionalAttributes.residentialCountry}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.additionalAttributes.residentialPostalCode}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'class',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Class
          </Button>
        );
      },
      cell: () => <p className="text-sm text-gray-800">N/A</p>,
    },
  ];

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const pageSize = parseInt(searchParams.get('limit')) || 10;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data: getStudentListResponse, isLoading: isStudentListLoading } =
    useGetStudentListQuery({
      page,
      pageSize,
    });
  const {
    isError: isDeleteStudentError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteStudentAsync,
  } = useDeleteStudentMutationQuery();

  const handleViewClick = (studentId) => {
    router.push(`/students/${studentId}`);
  };
  const handleEditClick = (studentId) => {
    router.push(`/students/${studentId}/editStudent`);
  };
  const handleOnPageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());

      router.push(pathname + '?' + params.toString());
    },
    [searchParams, pathname, router]
  );
  useEffect(() => {
    if (isDeleteStudentError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting student',
      });
    }
  }, [isDeleteStudentError]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Student deleted successfully',
      });
      setSelectedStudent(null);
    }
  }, [isDeleteSuccess]);

  const table = useReactTable({
    columns,
    data: getStudentListResponse?.data || [],
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
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
                          onClick={() => {
                            handleEditClick(row.original.id);
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
                          <span className="mx-1 font-semibold">{`${row.original.firstName}`}</span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onMouseEnter={() => {
                            router.prefetch(`/students/${row.original.id}`);
                          }}
                          onClick={() => {
                            handleViewClick(row.original.id);
                          }}
                          variant="mild"
                          className="mr-3 h-auto px-3 py-2"
                        >
                          <Eye size={12} className="text-center text-black" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          <span>view</span>
                          <span className="mx-1 font-semibold">{`${row.original.firstName}`}</span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="h-auto px-3 py-2"
                          variant="mild"
                          onClick={() => {
                            setSelectedStudent(row.original);
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
                          <span className="mx-1 font-semibold">{`${row.original.firstName}`}</span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {isStudentListLoading ? 'Loading...' : 'No Student Found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <When
        condition={
          getStudentListResponse?.data?.length && !isStudentListLoading
        }
      >
        <Pagination
          limit={limit.toString()}
          onPageChange={handleOnPageChange}
          pageSize={getStudentListResponse?.pageSize || 0}
          totalRecords={getStudentListResponse?.total || 0}
          disabled={isStudentListLoading}
          onLimitChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.set('limit', value.toString());

            router.replace(pathname + '?' + params.toString());
          }}
        />
        <DeleteConfirmationModal
          open={showDeleteConfirmationModal}
          description={`Are you sure you want to delete "${selectedStudent?.firstName}"`}
          onDeleteClick={async () => {
            if (selectedStudent) {
              setShowDeleteConfirmationModal(false);
              await deleteStudentAsync(selectedStudent.id);
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
