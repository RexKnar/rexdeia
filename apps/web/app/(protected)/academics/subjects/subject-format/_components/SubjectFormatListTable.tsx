'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Button } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'ui/components/ui/Table';

export function SubjectFormatListTable() {
  return (
    <section>
      <div className="rounded-md ">
        <Table>
          <TableRow className="cursor-pointer hover:bg-white">
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
          <TableBody>
            <TableCell className="font-medium">Subject Format Name</TableCell>
            <TableCell>isActive</TableCell>
            <TableCell className="flex w-24 justify-between">
              <Button variant="mild" className="h-auto px-3 py-2">
                <Pencil size={12} className="text-center text-black" />
              </Button>
              <Button variant="mild" className="h-auto px-3 py-2">
                <Trash2 size={12} className="text-center text-red-600" />
              </Button>
            </TableCell>
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
