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
import { BoxSelect, ChevronDown, ChevronRight, X } from 'lucide-react';
import React from 'react';
import {
  Avatar,
  AvatarImage,
  Button,
  Checkbox,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';
import { Table, TableBody, TableCell, TableRow } from 'ui/components/ui/Table';

function AssignStudentCell() {
  return (
    <div className="flex">
      <Button className="h-8 w-8 rounded-full p-0">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
function AssignedStudentCell() {
  return (
    <div className="flex">
      <Button className="h-8 w-8 rounded-full bg-red-500 p-0">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
export function AssignStudents() {
  type Students = {
    id: number;
    name: string;
  };
  const data: Students[] = [
    {
      id: 1,
      name: 'Rakesh',
    },
    {
      id: 2,
      name: 'rakes',
    },
    {
      id: 3,
      name: 'rakes',
    },
  ];
  const columns: ColumnDef<Students>[] = [
    {
      accessorKey: 'name',

      cell: () => (
        <div className="mb-2 flex items-center">
          <Checkbox className="mt-2" />
          <Avatar className="ml-3  mt-2 h-8 w-8 cursor-pointer ">
            <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
          </Avatar>
          <div className="ml-4 mt-2">
            <p className="font-semibold">Rakesh</p>
          </div>
        </div>
      ),
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
    <section className="flex justify-between gap-8">
      <section className="mr-2 mt-2 w-1/2 rounded-l-lg bg-zinc-50 p-4">
        <section className="mb-2 flex  justify-between overflow-x-auto rounded-md bg-white p-2 ">
          <Select>
            <SelectTrigger className="ml-0 basis-1/3">
              <SelectValue className="text-gray-400" placeholder="Class Name" />{' '}
              <ChevronDown className="text-gray-400" />
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
            <SelectTrigger className="ml-4 basis-1/3">
              <SelectValue className="text-gray-400" placeholder="Section" />{' '}
              <ChevronDown className="text-gray-400" />
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
            <SelectTrigger className="ml-4 basis-1/3">
              <SelectValue className="text-gray-400" placeholder="Exam" />{' '}
              <ChevronDown className="text-gray-400" />
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
        </section>
        <section className="flex justify-between p-2">
          <div className="mt-2 text-sm text-gray-800">All Students</div>
          <Button variant="outline" className="h-8 px-2">
            <BoxSelect className="mr-3 h-5 w-5" />
            select All
          </Button>
        </section>
        <section>
          <Table>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="py-0"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-0">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="flex items-center justify-end p-1">
                      <AssignStudentCell />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <p> No Student found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      </section>
      <section className="ml-2 mt-2 w-1/2 rounded-l-lg bg-zinc-50 p-4">
        <section className="flex justify-between p-2">
          <div className="mt-2 text-sm text-gray-800">Selected Students</div>
          <div>
            <Button className="h-8 border border-red-500 bg-zinc-50 px-2 text-red-500 hover:bg-zinc-50">
              <BoxSelect className="mr-3 h-5 w-5 text-red-500" />
              Deselect All
            </Button>
          </div>
        </section>
        <section>
          <Table>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="py-0"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-0">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="flex items-center justify-end p-1">
                      <AssignedStudentCell />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <p> No Student found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      </section>
    </section>
  );
}
