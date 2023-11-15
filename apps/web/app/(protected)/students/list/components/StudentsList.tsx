'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from 'ui';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';
import { cn } from 'utils';
export function StudentsList() {
  return (
    <section>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="cursor-pointer text-lg font-bold">
              <TableHead className="p-3">S.no</TableHead>
              <TableHead className="p-3">Student Name</TableHead>
              <TableHead className="p-3">Roll Number</TableHead>
              <TableHead className="p-3">Email Id</TableHead>
              <TableHead className="p-3">Class</TableHead>
              <TableHead className="p-3">Mobile Number</TableHead>
              <TableHead className="p-3">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow className={cn('cursor-pointer', 'cursor-pointer ')}>
              <TableCell>1</TableCell>
              <TableCell>Gopi</TableCell>
              <TableCell>B7S17568</TableCell>
              <TableCell>gopikumarcs443@gmail.com</TableCell>
              <TableCell>7th Std</TableCell>
              <TableCell>9600514791</TableCell>
              <TableCell className="flex items-center justify-center">
                <Button className="mr-1 bg-gray-200">
                  <Eye size={16} className="mr-2 text-sky-600" />
                </Button>
                <Button className="mr-1 bg-gray-200">
                  <Pencil size={16} className="mr-2 text-blac" />
                </Button>
                <Button className="bg-gray-200">
                  <Trash2 size={16} className="mr-2 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>

            <TableRow className={cn('cursor-pointer', 'cursor-pointer')}>
              <TableCell>1</TableCell>
              <TableCell>Gopi</TableCell>
              <TableCell>B7S17568</TableCell>
              <TableCell>gopikumarcs443@gmail.com</TableCell>
              <TableCell>7th Std</TableCell>
              <TableCell>9600514791</TableCell>
              <TableCell className="flex items-center justify-center">
                <Button className="mr-1 bg-gray-200">
                  <Eye size={16} className="mr-2 text-sky-600	" />
                </Button>
                <Button className="mr-1 bg-gray-200">
                  <Pencil size={16} className="mr-2 text-black" />
                </Button>
                <Button className="bg-gray-200">
                  <Trash2 size={16} className="mr-2 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
