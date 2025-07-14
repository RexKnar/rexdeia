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
  Search,
  Trash2,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { When } from 'react-if';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Pagination,
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

import { Staff } from '../../../../../lib/domain/staff';
import { useGetAllStaffListQuery } from '../../../../../lib/queries/staff/useGetAllStaffListQuery';

export function StaffList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const columns: ColumnDef<Staff>[] = [
    {
      accessorKey: 'firstName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="ml-3 px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Staff Name
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
                {row.original.firstName} {row.original.middleName}
                {row.original.lastName}
              </p>
              <div className="flex items-center">
                <CreditCardIcon size={16} className="mr-1 text-green-800" />
                <p className="text-sm text-gray-900">
                  {row.original.aadharCardNumber}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center">
                  <Gem size={12} className="mr-1 text-amber-700" />
                  <p className="text-sm text-gray-900">{row.original.gender}</p>
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
                  <p className="text-sm text-gray-800">{row.original.email}</p>
                </div>
                <div className="flex items-center">
                  <PhoneCallIcon className="mr-1 text-red-600" size={12} />
                  <p className="text-sm text-gray-800">{row.original.mobile}</p>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'permanentAddress1',
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
              {row.original.permanentAddress1}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.permanentCity}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.permanentState}
            </p>
            <p className="text-sm text-gray-800">
              {row.original.permanentPincode}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'currentAddressLine1',
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
              {row.original.currentAddressLine1}
            </p>
            <p className="text-sm text-gray-800">{row.original.currentCity}</p>
            <p className="text-sm text-gray-800">{row.original.currentState}</p>
            <p className="text-sm text-gray-800">
              {row.original.currentPincode}
            </p>
          </div>
        );
      },
    },
  ];

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data: getStaffListResponse, isLoading: isStaffListLoading } =
    useGetAllStaffListQuery({
      page,
      limit,
      searchTerm,
    });

  const handleEditClick = (studentId) => {
    router.push(`/staffs/${studentId}/edit`);
  };

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
    data: getStaffListResponse?.data || [],
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
      <div className="relative">
        <input
          type="search"
          placeholder="Search Staffs..."
          className="h-9 w-64 rounded-md border border-gray-300 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Search
          className="absolute right-2.5 top-2.5 text-gray-500"
          size={16}
        />
      </div>
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
                          variant="mild"
                          className="mr-3 h-auto px-3 py-2"
                          onClick={() => {
                            router.replace(`/staffs/${row.original.id}`);
                          }}
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
                        <Button className="h-auto px-3 py-2" variant="mild">
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
                <TableCell colSpan={5} className="">
                  {isStaffListLoading ? (
                    <div className="flex h-20 items-center justify-center">
                      <Loader2 className="mr-2 w-6 animate-spin text-black" />
                      <p className="text-black ">Fetching Staff List...</p>
                    </div>
                  ) : (
                    'Staffs not Found'
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <When
        condition={getStaffListResponse?.data?.length && !isStaffListLoading}
      >
        <Pagination
          pageNumber={page}
          limit={limit.toString()}
          onPageChange={handleOnPageChange}
          pageSize={getStaffListResponse?.limit || 0}
          totalRecords={getStaffListResponse?.total || 0}
          disabled={isStaffListLoading}
          onLimitChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.set('limit', value.toString());

            router.replace(pathname + '?' + params.toString());
          }}
        />
      </When>
    </section>
  );
}
