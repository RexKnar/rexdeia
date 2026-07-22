'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, List, Table as TableIcon, MoreHorizontal, Loader2, Landmark } from 'lucide-react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Badge,
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

import { useGetAllSectionByClassIdQuery } from '../../../../../../lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useGetSectionByIdQuery } from 'lib/queries/section/useGetSectionByIdQuery';
import { useGetStudentListBySectionIdQuery } from 'lib/queries/students/useGetStudentListBySectionIdQuery';
import { UnassignInchargeFlyout } from '../_modals/UnassignInchargeFlyout';
import { SectionCard } from '../section/[sectionId]/_components/SectionCard';

function SectionActionsDropdown({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Button variant="mild" className="h-8 px-1">
          <MoreHorizontal className="text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end" sideOffset={15}>
        <DropdownMenuItem className="flex cursor-pointer items-center" onClick={() => {}}>
          <span className="flex-1 text-sm text-gray-700">Reassign</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
        <DropdownMenuItem className="flex cursor-pointer flex-col items-center">
          <Button
            size="sm"
            className="flex-1 justify-start text-left text-gray-700"
            variant="link"
            onClick={(e) => {
              e.stopPropagation();
              const params = new URLSearchParams(searchParams.toString());
              params.set('isUnassignInchargeFlyoutOpen', 'true');
              params.set('sectionId', id);
              router.replace(`${pathname}?${params.toString()}`);
            }}
          >
            Un-Assign Incharge
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SectionTableRow({
  classId,
  id,
  name,
  staffIncharges,
}: {
  classId: string;
  id: string;
  name: string;
  staffIncharges: any[];
}) {
  const router = useRouter();
  const { data: studentList } = useGetStudentListBySectionIdQuery(id, {
    enabled: !!id,
  });
  const { data: SectionDetails, isLoading: isSectionDetailsLoading } =
    useGetSectionByIdQuery(id, {
      enabled: !!id,
    });

  const handleRowClick = () => {
    router.push(`/academics/class/${classId}/section/${id}`);
  };

  return (
    <TableRow className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleRowClick}>
      <TableCell className="font-semibold text-indigo-600 hover:underline pl-4">
        {name}
      </TableCell>
      <TableCell>
        <span className="rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
          Students: {studentList ? studentList.length : '-'}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {isSectionDetailsLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-indigo-700" />
          ) : SectionDetails && SectionDetails.group && SectionDetails.group.length > 0 ? (
            SectionDetails.group.map((group: any) => (
              <span
                key={group.id}
                className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 border border-gray-200"
              >
                {group.name}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">-</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {staffIncharges && staffIncharges.length > 0 ? (
            staffIncharges.map((staff) => (
              <span
                key={staff.id}
                className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 border border-green-200"
              >
                {[staff.firstName, staff.middleName, staff.lastName].filter(Boolean).join(' ')}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">No Incharge Assigned</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
        <SectionActionsDropdown id={id} />
      </TableCell>
    </TableRow>
  );
}

function SectionListItem({
  classId,
  id,
  name,
  staffIncharges,
}: {
  classId: string;
  id: string;
  name: string;
  staffIncharges: any[];
}) {
  const router = useRouter();
  const { data: studentList } = useGetStudentListBySectionIdQuery(id, {
    enabled: !!id,
  });
  const { data: SectionDetails, isLoading: isSectionDetailsLoading } =
    useGetSectionByIdQuery(id, {
      enabled: !!id,
    });

  const handleItemClick = () => {
    router.push(`/academics/class/${classId}/section/${id}`);
  };

  return (
    <div
      onClick={handleItemClick}
      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
          <Landmark size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
            <span className="rounded bg-yellow-100 px-2 py-0.2 text-[10px] text-yellow-800 font-medium">
              Students: {studentList ? studentList.length : '-'}
            </span>
            <span>•</span>
            <div className="inline-flex gap-1 items-center">
              <span className="text-gray-400">Groups:</span>
              {isSectionDetailsLoading ? (
                <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
              ) : SectionDetails && SectionDetails.group && SectionDetails.group.length > 0 ? (
                SectionDetails.group.map((g: any) => g.name).join(', ')
              ) : (
                'None'
              )}
            </div>
            {staffIncharges && staffIncharges.length > 0 && (
              <>
                <span>•</span>
                <span className="text-green-700 font-medium">
                  Incharge: {staffIncharges.map((s) => [s.firstName, s.middleName, s.lastName].filter(Boolean).join(' ')).join(', ')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <SectionActionsDropdown id={id} />
      </div>
    </div>
  );
}

export function SectionList() {
  const { classId } = useParams<{ classId: string }>();
  const [viewMode, setViewMode] = useState<'card' | 'table' | 'list'>('card');

  useEffect(() => {
    const savedMode = localStorage.getItem('rexdeia-view-mode-sections');
    if (savedMode === 'card' || savedMode === 'table' || savedMode === 'list') {
      setViewMode(savedMode);
    }
  }, []);

  const handleViewModeChange = (mode: 'card' | 'table' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('rexdeia-view-mode-sections', mode);
  };

  const filter = {};
  const { data: sectionListResponse, isLoading: isSectionListLoading } =
    useGetAllSectionByClassIdQuery(
      { classId, filter },
      {
        enabled: !!classId,
      }
    );

  if (isSectionListLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black">Fetching Section List...</p>
      </div>
    );
  }

  if (!sectionListResponse || !sectionListResponse.data || sectionListResponse.data.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-black">No Data Found</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* View Switcher Toolbar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <span className="text-sm font-semibold text-gray-700">
          Sections ({sectionListResponse.data.length})
        </span>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-0.5 border border-gray-200">
          <button
            onClick={() => handleViewModeChange('card')}
            className={cn(
              'rounded-md p-1.5 transition-all',
              viewMode === 'card'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
            )}
            title="Card View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => handleViewModeChange('table')}
            className={cn(
              'rounded-md p-1.5 transition-all',
              viewMode === 'table'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
            )}
            title="Table View"
          >
            <TableIcon size={16} />
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={cn(
              'rounded-md p-1.5 transition-all',
              viewMode === 'list'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
            )}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Grid / Card View */}
      {viewMode === 'card' && (
        <section className="grid w-full grid-cols-1 gap-4 px-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sectionListResponse.data.map((sectionItem) => (
            <SectionCard
              key={sectionItem.id}
              id={sectionItem.id}
              name={sectionItem.name}
              classId={classId}
              staffIncharges={sectionItem.staffIncharges}
            />
          ))}
        </section>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Section Name</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Groups</TableHead>
                <TableHead>Staff Incharges</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectionListResponse.data.map((sectionItem) => (
                <SectionTableRow
                  key={sectionItem.id}
                  classId={classId}
                  id={sectionItem.id}
                  name={sectionItem.name}
                  staffIncharges={sectionItem.staffIncharges || []}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="flex flex-col gap-2">
          {sectionListResponse.data.map((sectionItem) => (
            <SectionListItem
              key={sectionItem.id}
              classId={classId}
              id={sectionItem.id}
              name={sectionItem.name}
              staffIncharges={sectionItem.staffIncharges || []}
            />
          ))}
        </div>
      )}

      <UnassignInchargeFlyout />
    </div>
  );
}
