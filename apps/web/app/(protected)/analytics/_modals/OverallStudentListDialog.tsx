import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

export function OverallStudentListDialog({
  studentList,
  title,
  subTitle,
}: {
  studentList: any[];
  title: string;
  subTitle: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get('isListDialogOpen') === 'true';

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.delete('isListDialogOpen');

    router.replace(pathname + '?' + params.toString());
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      closeFlyout();
    }
  };

  const createColumns = useCallback(() => {
    const baseColumns: ColumnDef<any>[] = [
      {
        accessorKey: 'index',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="w-full"
            >
              #
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-center">{Number(row.index) + 1}</div>
        ),
      },

      {
        id: 'fullName',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="w-full"
            >
              Student Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="items-left flex gap-2">
            {`${row.original.firstName} ${row.original.lastName}`}
            <span className="text-muted-foreground text-xs">
              ({row.original.section.name})
            </span>
          </div>
        ),
      },
    ];

    return baseColumns;
  }, [studentList]);

  const columns = createColumns();

  const table = useReactTable({
    data: studentList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title} ({subTitle})
          </DialogTitle>
          <DialogDescription>
            <section className="max-h-[80vh] overflow-y-auto">
              <Table className="border-1 border">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-primary-300">
                      {headerGroup.headers.map((header) => (
                        <TableCell key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
