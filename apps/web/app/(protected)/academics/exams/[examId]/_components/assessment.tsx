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
  VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import {
  Avatar,
  AvatarImage,
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Toggle,
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

type Marks = {
  id: number;
  student: string;
  Tamil: string;
  Maths: string;
  English: string;
  Chemistry: string;
  Physics: string;
  Botany: string;
  Zoology: string;
};
const data: Marks[] = [
  {
    id: 1,
    student: 'Rakesh',
    Tamil: 'zx',
    Maths: 'as',
    English: 'zc',
    Chemistry: 'df',
    Physics: 'ess',
    Botany: 'ke',
    Zoology: 'as',
  },
  {
    id: 2,
    student: 'rakes',
    Tamil: 'z',
    Maths: 'as',
    English: 'zc',
    Chemistry: 'df',
    Physics: 'ess',
    Botany: 'ke',
    Zoology: 'as',
  },
];

function AssessmentTableCell() {
  const [isToggled, setIsToggled] = useState(false);
  const handleOnToggleChange = () => {
    setIsToggled(!isToggled);
  };
  return (
    <div className="lex m-1 flex items-center justify-between lowercase">
      <Input
        className=" ml-2 h-8 w-14 rounded-lg border-gray-600 px-3 py-1 text-center placeholder-gray-600 shadow-sm"
        placeholder="FA1"
      />
      <Input
        className=" ml-2 h-8 w-14 rounded-lg border-gray-600 px-3 py-1 text-center placeholder-gray-600 shadow-sm"
        placeholder="FA1"
      />
      <Input
        className=" ml-2 h-8 w-14 rounded-lg border-gray-600 px-3 py-1 text-center placeholder-gray-600 shadow-sm"
        placeholder="FA1"
      />
      <Toggle
        className={`ml-2 h-10 w-10 rounded-full px-3 py-1 text-center ${
          isToggled ? 'bg-red-400 text-white' : 'bg-gray-400'
        }`}
        variant="outline"
        onClick={handleOnToggleChange}
      >
        <p>A</p>
      </Toggle>
    </div>
  );
}

export function Assessment() {
  const columns: ColumnDef<Marks>[] = [
    {
      accessorKey: 'student',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0 "
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Students
          </Button>
        );
      },
      cell: () => (
        <div className="mb-2 flex items-center">
          <Avatar className="ml-3 h-12 w-12 cursor-pointer ">
            <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
          </Avatar>
          <div className="ml-4">
            <p className="font-semibold">Rakesh</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'Tamil',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tamil
          </Button>
        );
      },
      cell: AssessmentTableCell,
    },
    {
      accessorKey: 'Maths',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Maths
          </Button>
        );
      },
      cell: AssessmentTableCell,
    },
    {
      accessorKey: 'English',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            English
          </Button>
        );
      },
      cell: AssessmentTableCell,
    },
    {
      accessorKey: 'Chemistry',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Chemistry
          </Button>
        );
      },
      cell: AssessmentTableCell,
    },
    {
      accessorKey: 'Physics',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Physics
          </Button>
        );
      },
      cell: AssessmentTableCell,
    },
    {
      accessorKey: 'Botany',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Botany
          </Button>
        );
      },
      cell: AssessmentTableCell,
    },
    {
      accessorKey: 'Zoology',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Zoology
          </Button>
        );
      },
      cell: AssessmentTableCell,
    },
  ];
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="mb-4 flex justify-between overflow-x-auto rounded-md bg-white">
        <Select>
          <SelectTrigger className="ml-0 basis-1/5">
            <SelectValue className="text-gray-400" placeholder="Class Name" />{' '}
            <ChevronDown className="text-primary-400" />
          </SelectTrigger>
          <SelectContent className="border border-primary-200">
            <SelectGroup>
              <SelectItem value={'Value1'}>Value1</SelectItem>
              <SelectItem value={'Value2'}>Value2</SelectItem>
              <SelectItem value={'Value3'}>Value3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="ml-4 basis-1/5">
            <SelectValue className="text-gray-400" placeholder="Section" />{' '}
            <ChevronDown className="text-primary-400" />
          </SelectTrigger>
          <SelectContent className="border border-primary-200">
            {' '}
            <SelectGroup>
              <SelectItem value={'Value1'}>Value1</SelectItem>
              <SelectItem value={'Value2'}>Value2</SelectItem>
              <SelectItem value={'Value3'}>Value3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="ml-4 basis-1/5">
            <SelectValue className="text-gray-400" placeholder="Exam" />{' '}
            <ChevronDown className="text-primary-400" />
          </SelectTrigger>
          <SelectContent className="border border-primary-200">
            {' '}
            <SelectGroup>
              <SelectItem value={'Value1'}>Value1</SelectItem>
              <SelectItem value={'Value2'}>Value2</SelectItem>
              <SelectItem value={'Value3'}>Value3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="ml-4 basis-1/5">
            <SelectValue className="text-gray-400" placeholder="Staff Name" />{' '}
            <ChevronDown className="text-primary-400" />
          </SelectTrigger>
          <SelectContent className="border border-primary-200">
            {' '}
            <SelectGroup>
              <SelectItem value={'Value1'}>Value1</SelectItem>
              <SelectItem value={'Value2'}>Value2</SelectItem>
              <SelectItem value={'Value3'}>Value3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="ml-4 basis-1/5">
            <SelectValue className="text-gray-400" placeholder="Subject" />{' '}
            <ChevronDown className="text-primary-400" />
          </SelectTrigger>
          <SelectContent className="border border-primary-200">
            {' '}
            <SelectGroup>
              <SelectItem value={'Value1'}>Value1</SelectItem>
              <SelectItem value={'Value2'}>Value2</SelectItem>
              <SelectItem value={'Value3'}>Value3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="w-56 cursor-pointer bg-gray-200"
              >
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'text-center',
                        index === 0
                          ? 'sticky left-0 bg-purple-50'
                          : index === 1
                            ? 'bg-orange-50'
                            : index === 2
                              ? 'bg-blue-50'
                              : index === 3
                                ? 'bg-green-50'
                                : index === 4
                                  ? 'bg-yellow-50'
                                  : index === 5
                                    ? 'bg-purple-50'
                                    : index === 6
                                      ? 'bg-pink-50'
                                      : index === 7
                                        ? 'bg-indigo-50'
                                        : 'bg-gray-200'
                      )}
                    >
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
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={`${
                    rowIndex === 0 ? 'sticky left-0 border-b bg-green-50' : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={`${
                        index === 0
                          ? 'sticky left-0 border-b bg-purple-50'
                          : index === 1
                            ? 'bg-orange-50'
                            : index === 2
                              ? 'bg-blue-50'
                              : index === 3
                                ? 'bg-green-50'
                                : index === 4
                                  ? 'bg-yellow-50'
                                  : index === 5
                                    ? 'bg-purple-50'
                                    : index === 6
                                      ? 'bg-pink-50'
                                      : index === 7
                                        ? 'bg-indigo-50'
                                        : 'bg-gray-200'
                      } w-auto min-w-56 py-0`}
                    >
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
