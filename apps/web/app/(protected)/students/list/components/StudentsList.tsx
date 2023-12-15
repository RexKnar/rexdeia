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
  Edit2Icon,
  Gem,
  HeartPulse,
  MailPlusIcon,
  PhoneCallIcon,
  Trash2Icon,
} from 'lucide-react';
import React, { useState } from 'react';
import { Else, If, Then } from 'react-if';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Pagination,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';
import { cn, titilize } from 'utils';

import { DeleteConfirmationModal } from '../../../../../lib/components/modals/DeleteConfirmationModal';
import { Student } from '../../../../../lib/domain';
import { useGetStudentListQuery } from '../../../../../lib/queries/useGetStudentListQuery';

export function StudentsList() {
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleDeleteStudentClick = (student: Student) => () => {
    setSelectedStudent(student);
    setShowDeleteConfirmationModal(true);
  };

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
              {row.original.additionalAttributes.permanentDistrict}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.additionalAttributes.permanentState}
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
              {row.original.additionalAttributes.residentialDistrict}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.additionalAttributes.residentialState}
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
    {
      accessorKey: 'actions',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          ></Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex">
            <Button
              variant="mild"
              className="p-1"
              onClick={handleDeleteStudentClick(row.original)}
            >
              <Trash2Icon size={24} className="mr-2 pl-2 text-red-500" />
            </Button>

            <Button variant="mild" className="ml-2 p-1">
              <Edit2Icon size={24} className="mr-2 pl-2 text-blue-600" />
            </Button>
          </div>
        );
      },
    },
  ];

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data: getStudentListResponse, isLoading: isStudentListLoading } =
    useGetStudentListQuery({
      page,
      pageSize,
    });

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
      <DeleteConfirmationModal
        description={`Are you sure you want to delete ${selectedStudent?.firstName} ${selectedStudent?.lastName} ?`}
        open={showDeleteConfirmationModal}
        onDeleteClick={() => {
          setShowDeleteConfirmationModal(false);
        }}
        onCancelClick={() => {
          setShowDeleteConfirmationModal(false);
        }}
      />
      <div className="rounded-md border">
        <If condition={isStudentListLoading}>
          <Then>
            <section className="flex h-96 w-full flex-col items-center justify-center gap-4">
              <Spinner />
              <p>Fetching Student&apos;s list</p>
            </section>
          </Then>
          <Else>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="cursor-pointer">
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
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={cn('cursor-pointer')}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No Admissions Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Else>
        </If>
      </div>

      <section className="mt-5 flex justify-between">
        <section>
          <Select
            disabled={isStudentListLoading}
            onValueChange={(value) => {
              setPageSize(parseInt(value));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Page Size: " />
              <div className="ml-1">10</div>
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
        </section>
        <Pagination
          pageSize={getStudentListResponse?.pageSize || 0}
          totalRecords={getStudentListResponse?.total || 0}
          onPageChange={(page) => {
            setPage(page);
          }}
        />
      </section>
    </section>
  );
}
