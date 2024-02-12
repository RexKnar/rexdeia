'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'ui/components/ui/Table';

export function CategoryListTable() {
  return (
    <section>
      <div className="rounded-md ">
        <Table>
          <TableRow className="cursor-pointer hover:bg-white">
            <TableHead>Parent Category</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
          <TableBody>
            <TableCell className="font-medium">Parent Category Name</TableCell>
            <TableCell>Category Name</TableCell>
            <TableCell>isActive</TableCell>
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
