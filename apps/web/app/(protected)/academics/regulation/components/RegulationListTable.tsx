'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, Eye, Pencil, Trash2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';
import { cn } from 'utils';

import { useGetRegulationListQuery } from '../../../../../lib/queries/useGetRegulationListQuery';

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'regulationName',
    header: ({ column }) => {
      return (
        <Button
          className="font-semibold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Regulation Name
        </Button>
      );
    },
  },
  {
    accessorKey: 'announcedYear',
    header: ({ column }) => {
      return (
        <Button
          className="font-semibold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Announced Year
        </Button>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => {
      return (
        <Button
          className="font-semibold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
        </Button>
      );
    },
  },
];

export function RegulationListTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = searchParams.get('page');

  const { data: regulationListResponse, isLoading } = useGetRegulationListQuery(
    {
      limit: 10,
      page: page ? parseInt(page) : 1,
    }
  );

  const handleOnNextPageClick = useCallback(() => {
    const currentPage = parseInt(page) || 1;
    const params = new URLSearchParams(searchParams);
    params.set('page', (currentPage + 1).toString());

    router.push(pathname + '?' + params.toString());
  }, [page, pathname, router, searchParams]);

  const handleOnPreviousPageClick = useCallback(() => {
    const currentPage = parseInt(page) || 1;
    const nextPage = currentPage - 1 || 1;
    const params = new URLSearchParams(searchParams);
    params.set('page', nextPage.toString());

    router.push(pathname + '?' + params.toString());
  }, [page, pathname, router, searchParams]);

  const table = useReactTable({
    columns,
    data: regulationListResponse?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className="pt-6">
      <div className="rounded-md ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="cursor-pointer hover:bg-white"
              >
                <TableHead className="ms-2 cursor-pointer text-center font-semibold">
                  S.no
                </TableHead>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-lg font-semibold"
                      key={header.id}
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
                <TableHead className="ms-1 cursor-pointer ps-6 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'cursor-pointer',
                    index % 2 !== 0 && 'cursor-pointer'
                  )}
                >
                  <TableCell className="ps-6">{index + 1}</TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive">
                      <Eye
                        size={16}
                        className="mr-2 text-center text-primary"
                      />
                    </Button>
                    <Button variant="destructive" className="mr-1 ">
                      <Pencil
                        size={16}
                        className="mr-2 text-center text-black"
                      />
                    </Button>
                    <Button variant="destructive" className="mr-1 ">
                      <Trash2
                        size={16}
                        className="mr-2	 text-center text-red-600"
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {isLoading ? 'Loading...' : 'No Regulation Found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <div className="mt-7 flex justify-between">
          <div className="flex items-center text-sm font-normal text-gray-700">
            Entries per page
            <div className="flex items-center border">
              <span className="px-2 py-1 text-black ">10</span>
              <ChevronDown size={14} className="mr-1" />
            </div>
          </div>
          <div className="flex">
            <Button
              variant="ghost"
              onClick={handleOnPreviousPageClick}
              className="px-3 py-1 text-sm font-normal text-gray-700"
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              onClick={handleOnNextPageClick}
              className="px-3 py-1 text-sm font-normal text-gray-700"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// 'use client';

// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from '@tanstack/react-table';
// import { ChevronDown, Eye, Pencil, Trash2 } from 'lucide-react';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import { useCallback } from 'react';
// import { Button } from 'ui';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from 'ui/components/ui/Table';
// import { cn } from 'utils';

// import { useGetRegulationListQuery } from '../../../../../lib/queries/useGetRegulationListQuery';

// const columns: ColumnDef<any>[] = [
//   {
//     accessorKey: 'regulationName',
//     header: ({ column }) => {
//       return (
//         <Button
//           className="font-semibold"
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Regulation Name
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       return (
//         <div className="ps-6 text-left">{row.getValue('regulationName')}</div>
//       );
//     },
//   },
//   {
//     accessorKey: 'announcedYear',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Announced Year
//         </Button>
//       );
//     },
//   },
//   {
//     accessorKey: 'isActive',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           Active Status
//         </Button>
//       );
//     },
//   },
// ];

// export function RegulationListTable() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const page = searchParams.get('page');

//   const { data: regulationListResponse, isLoading } = useGetRegulationListQuery(
//     {
//       limit: 10,
//       page: page ? parseInt(page) : 1,
//     }
//   );

//   const handleOnNextPageClick = useCallback(() => {
//     const currentPage = parseInt(page) || 1;
//     const params = new URLSearchParams(searchParams);
//     params.set('page', (currentPage + 1).toString());

//     router.push(pathname + '?' + params.toString());
//   }, [page, pathname, router, searchParams]);

//   const handleOnPreviousPageClick = useCallback(() => {
//     const currentPage = parseInt(page) || 1;
//     const nextPage = currentPage - 1 || 1;
//     const params = new URLSearchParams(searchParams);
//     params.set('page', nextPage.toString());

//     router.push(pathname + '?' + params.toString());
//   }, [page, pathname, router, searchParams]);

//   const table = useReactTable({
//     columns,
//     data: regulationListResponse?.data || [],
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   return (
//     <section className="mt-3">
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow
//                 key={headerGroup.id}
//                 className="cursor-pointer  text-lg "
//               >
//                 <TableHead className="ms-2 cursor-pointer text-center font-bold">
//                   S.no
//                 </TableHead>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//                 <TableHead className="cursor-pointer ps-6 font-bold">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             ))}
//           </TableHeader>

//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row, index) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && 'selected'}
//                   className={cn(
//                     'cursor-pointer',
//                     index % 2 !== 0 && 'cursor-pointer'
//                   )}
//                 >
//                   <TableCell className="text-center">{index + 1}</TableCell>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                   <TableCell>
//                     <Button variant="destructive">
//                       <Eye
//                         size={16}
//                         className="mr-2 text-center text-primary"
//                       />
//                     </Button>
//                     <Button variant="destructive" className="mr-1 ">
//                       <Pencil
//                         size={16}
//                         className="mr-2 text-center text-black"
//                       />
//                     </Button>
//                     <Button variant="destructive" className="mr-1 ">
//                       <Trash2
//                         size={16}
//                         className="mr-2	 text-center text-red-600"
//                       />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} className="h-24 text-center">
//                   {isLoading ? 'Loading...' : 'No Regulation Found'}
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div>
//         <div className="mt-7 flex justify-between">
//           <div className="flex items-center text-sm font-normal text-gray-700">
//             Entries per page
//             <div className="flex items-center border">
//               <span className="px-2 py-1 text-black ">10</span>
//               <ChevronDown size={14} className="mr-1" />
//             </div>
//           </div>
//           <div className="flex">
//             <Button
//               variant="ghost"
//               onClick={handleOnPreviousPageClick}
//               className="px-3 py-1 text-sm font-normal text-gray-700"
//             >
//               Previous
//             </Button>
//             <Button
//               variant="ghost"
//               onClick={handleOnNextPageClick}
//               className="px-3 py-1 text-sm font-normal text-gray-700"
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
