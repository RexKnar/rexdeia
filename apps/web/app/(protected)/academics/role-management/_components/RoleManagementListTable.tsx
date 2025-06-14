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
import { useGetRoleListQuery } from 'lib/queries/role-management/useGetRoleListMutationQuery';
import { Pencil, PlusCircleIcon, Trash2, UserPlus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { When } from 'react-if';
import {
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

import { LinkButton } from '@/components/LinkButton';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

import { RoleModel } from '../../../../../lib/domain/role';
import { EditRoleManagementFlyout } from '../_modals/EditRoleManagementFlyout';

export function RoleManagementListTable() {
  const [showRoleDeleteConfirmationModal, setShowRoleDeleteConfirmationModal] =
    useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleModel | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const { data: getRoleListResponse, isLoading: isRoleListLoading } =
    useGetRoleListQuery(page, limit);

  const columns: ColumnDef<RoleModel>[] = [
    {
      accessorKey: 'name',
      header: () => (
        <Button variant="ghost" className="px-0">
          Role
        </Button>
      ),
      cell: ({ row }) => <div className="flex">{row.original.name}</div>,
    },
    {
      accessorKey: 'moduleAccess',
      header: () => (
        <Button variant="ghost" className="px-0">
          Module Access
        </Button>
      ),
      cell: ({ row }) => {
        const modelAccess = Array.isArray(row.original.moduleAccess)
          ? row.original.moduleAccess
          : row.original.moduleAccess
            ? [row.original.moduleAccess]
            : [];

        return (
          <div className="grid grid-cols-5 gap-2">
            {modelAccess.length > 0 ? (
              modelAccess.map((access, idx) => (
                <div
                  key={access.module || idx}
                  className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="mb-2 text-sm font-semibold capitalize text-indigo-700">
                      {access.module}
                    </div>
                    <Button
                      variant="ghost"
                      className="mb-2 h-8 w-8 p-1"
                      onClick={() => handleEditRole(row.original)}
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Tooltip>
                      {' '}
                      <TooltipTrigger asChild>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            access.create
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          C
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            access.read
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          R
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Read</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      {' '}
                      <TooltipTrigger asChild>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            access.update
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          U
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Update</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            access.delete
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          D
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-sm italic text-gray-400">
                No access assigned
              </span>
            )}

            <div className="mt-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-700 text-sm text-gray-700"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('isPermissionFlyoutOpen', 'true');
                  params.set('roleId', row.original.id);
                  router.replace(pathname + '?' + params.toString());
                }}
              >
                <PlusCircleIcon size={16} className="text-gray-600" />
                Add More
              </Button>
            </div>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    columns,
    data: getRoleListResponse?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleOnPageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      router.push(pathname + '?' + params.toString());
    },
    [searchParams, pathname, router]
  );

  const handleEditRole = useCallback(
    (role: RoleModel) => {
      const params = new URLSearchParams(window.location.search);
      params.set('isEditRoleFlyoutOpen', 'true');
      params.set('roleId', role.id);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router]
  );
  // const handleAssignRole = useCallback(
  //   (role: RoleModel) => {
  //     const params = new URLSearchParams(searchParams);
  //     params.set('isAssignUsersOpen', 'true');
  //     params.set('roleId', role.id);
  //     router.replace(pathname + '?' + params.toString());
  //   },
  //   [searchParams, pathname, router]
  // );

  const handleDeleteRole = useCallback((role: RoleModel) => {
    setSelectedRole(role);
    setShowRoleDeleteConfirmationModal(true);
  }, []);

  return (
    <section>
      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="cursor-pointer hover:bg-white"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                <TableHead>
                  <Button variant="ghost" className="px-0">
                    Actions
                  </Button>
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="ml-3" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="flex w-52 gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <LinkButton
                          variant="outline"
                          url={`/academics/role-management/${row.original.id}`}
                          className="h-auto border-gray-700 px-3 py-2"
                        >
                          <UserPlus
                            size={12}
                            className="text-center text-gray-900 "
                          />
                        </LinkButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Assign</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="h-auto px-3 py-2"
                          variant="mild"
                          onClick={() => handleDeleteRole(row.original)}
                        >
                          <Trash2
                            size={12}
                            className="text-center text-red-600"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  {isRoleListLoading ? 'Loading...' : 'No Role Found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <When condition={getRoleListResponse?.data?.length && !isRoleListLoading}>
        <Pagination
          limit={limit.toString()}
          pageSize={limit}
          pageNumber={page}
          totalRecords={getRoleListResponse?.total || 0}
          onPageChange={handleOnPageChange}
          disabled={isRoleListLoading}
          onLimitChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.set('limit', value.toString());
            params.set('page', '1');
            router.replace(pathname + '?' + params.toString());
          }}
        />
      </When>

      <DeleteConfirmationModal
        open={showRoleDeleteConfirmationModal}
        description={`Are you sure you want to delete "${selectedRole?.name}"?`}
        onDeleteClick={async () => {
          if (selectedRole) {
            setShowRoleDeleteConfirmationModal(false);
            setSelectedRole(null);
          }
        }}
        onCancelClick={() => {
          setShowRoleDeleteConfirmationModal(false);
          setSelectedRole(null);
        }}
      />
      <EditRoleManagementFlyout />
    </section>
  );
}
