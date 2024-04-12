import React from 'react';
import { Button } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

const columns = [
  {
    accessorKey: 'name',
    header: () => (
      <Button variant="ghost" className="px-0 ">
        Exam Type Name
      </Button>
    ),
  },
  {
    accessorKey: 'frequency',
    header: () => (
      <Button variant="ghost" className="px-0 ">
        Frequency
      </Button>
    ),
  },
  {
    accessorKey: 'isActive',
    header: () => (
      <Button variant="ghost" className="px-0 ">
        Status
      </Button>
    ),
    cell: ({ row }) => (
      <span
        className={`ml-1 rounded px-2 py-1 text-center text-sm font-medium text-gray-100
       ${row.original.isActive ? 'bg-green-600' : 'bg-red-600'}`}
      >
        {row.original.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

export function ExamTypeListTable() {
  return (
    <section>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead className="py-1" key={index}>
                {column.header()}
              </TableHead>
            ))}
            <TableHead>
              <Button variant="ghost" className="px-0">
                Actions
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No Exam Type Found
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
}
