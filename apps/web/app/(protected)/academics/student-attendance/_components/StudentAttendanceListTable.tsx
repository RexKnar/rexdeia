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
import { ChevronDown, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Avatar,
  AvatarImage,
  Button,
  DateSelector,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Toggle,
} from 'ui';
import { Table, TableBody, TableCell, TableRow } from 'ui/components/ui/Table';
import { cn } from 'utils';

function AttendanceTableCell() {
  const [isToggled, setIsToggled] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleOnToggleChange = () => {
    setIsToggled(!isToggled);
    setIsButtonDisabled(!isToggled);
  };
  const [isClicked, setIsClicked] = useState(false);
  const handleOnClick = () => {
    setIsClicked(!isClicked);
  };
  const [isPressed, setIsPressed] = useState(false);
  const handleOnPressed = () => {
    setIsPressed(!isPressed);
  };

  return (
    <>
      <div className="flex">
        <Toggle
          className={`ml-2 h-8 w-8 rounded-full px-3 py-1 text-center ${
            isToggled ? 'bg-primary text-white' : 'bg-gray-400'
          }`}
          variant="outline"
          onClick={handleOnToggleChange}
        >
          <p>P</p>
        </Toggle>
        <Toggle
          className={`ml-2 h-8 w-8 rounded-full px-3 py-1 text-center ${
            isClicked ? 'bg-red-500 text-white' : 'bg-gray-400'
          }`}
          variant="outline"
          onClick={handleOnClick}
        >
          <p>A</p>
        </Toggle>
        <Toggle
          className={`ml-2 h-8 w-8 rounded-full px-3 py-1 text-center ${
            isPressed ? 'bg-orange-300' : 'bg-gray-400'
          }`}
          variant="outline"
          onClick={handleOnPressed}
        >
          <p>L</p>
        </Toggle>
      </div>
      <Button
        variant="outline"
        className="ml-4 h-8 text-xs"
        disabled={isButtonDisabled}
      >
        <MessageSquare className="p-1" />
        Contact Parents
      </Button>
    </>
  );
}
export function StudentAttendanceListTable() {
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
          <div className="mt-2 font-semibold text-gray-700">01</div>
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
  const { setValue } = useForm();
  const [announcedYear, setAnnouncedYear] = useState(null);

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
    <section className="rounded-lg bg-zinc-50 py-0">
      <div className="p-4">
        <h6>All Students</h6>
      </div>
      <section className="flex">
        <section className="w-1/4">
          <section
            className={cn(
              'flex w-full cursor-pointer flex-col gap-2 rounded-md border-[1.5px] bg-white p-4 shadow-sm'
            )}
          >
            <div className="text-sm font-normal text-gray-700">
              Total Students
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-md font-semibold">32</div>
            </div>
          </section>
          <section
            className={cn(
              'mt-1 flex w-full cursor-pointer flex-col gap-4 rounded-md border-[1.5px] bg-white p-4 shadow-sm'
            )}
          >
            <div className="flex justify-between">
              <section className="flex w-1/2 flex-col gap-2">
                <div className="text-sm font-normal text-gray-700">
                  Absenties
                </div>
                <div className="text-sm font-semibold">6</div>
              </section>
              <section className="flex w-1/2 flex-col gap-2">
                <div className="text-sm font-normal text-gray-700">OnLeave</div>
                <div className="text-sm font-semibold">2</div>
              </section>
            </div>
          </section>
          <section
            className={cn(
              'flex w-full cursor-pointer justify-center gap-4 rounded-md border-[1.5px] bg-white p-4 shadow-sm'
            )}
          >
            <div className="flex items-center">
              <Button variant="outline" className="h-8 text-xs ">
                <MessageSquare className="p-1" />
                Contact Parents
              </Button>
            </div>
          </section>
          <section
            className={cn(
              'mt-1 flex w-full cursor-pointer flex-col gap-4 rounded-md border-[1.5px] bg-white p-2 shadow-sm '
            )}
          >
            <section>
              <DateSelector
                id="announcedYear"
                required
                autoComplete="off"
                placeholderText="27/02/2024"
                onChange={(value) => {
                  setValue('announcedYear', value);
                  setAnnouncedYear(value);
                }}
                dateFormat="dd/MM/yyyy"
                selected={announcedYear}
                isClearable={false}
              />
            </section>
            <section>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Class Name"
                    className="text-gray-400 placeholder-gray-300"
                  />{' '}
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
            <section>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    className=" placeholder-gray-300"
                    placeholder="Section"
                  />{' '}
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
            <section>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    className="text-gray-400"
                    placeholder="Staff Name"
                  />{' '}
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
            <section>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    className="text-gray-400"
                    placeholder="Subject"
                  />{' '}
                  <ChevronDown className="text-gray-400" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200">
                  {' '}
                  <SelectGroup>
                    <SelectItem value={'Value1'}>Value1</SelectItem>
                    <SelectItem value={'Value2'}>Value2</SelectItem>
                    <SelectItem value={'Value3'}>Value3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </section>
            <section>
              <Select>
                <SelectTrigger>
                  <SelectValue className="text-gray-400" placeholder="period" />{' '}
                  <ChevronDown className="text-gray-400" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200">
                  {' '}
                  <SelectGroup>
                    <SelectItem value={'Value1'}>Value1</SelectItem>
                    <SelectItem value={'Value2'}>Value2</SelectItem>
                    <SelectItem value={'Value3'}>Value3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </section>
          </section>
        </section>
        <section className="ml-4 w-3/4 p-2">
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
                      <AttendanceTableCell />
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
