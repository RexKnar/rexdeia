'use client';

import { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, List, Table as TableIcon, MoreHorizontal, Loader2, Search } from 'lucide-react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
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

import { useGetStaffListByClassIdQuery } from '../../../../../../lib/queries/staff/useGetStaffListByClassIdQuery';
import { useGetStaffListBySectionIdQuery } from '../../../../../../lib/queries/staff/useGetStaffListBySectionIdQuery';
import { StaffCard } from '../section/[sectionId]/_components/StaffCard';

function StaffActionsDropdown({ id }: { id: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <Button variant="mild" className="h-8 px-1">
          <MoreHorizontal className="text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end" sideOffset={15}>
        <DropdownMenuItem className="flex cursor-pointer flex-col items-center">
          <Button
            variant="link"
            size="sm"
            className="flex-1 justify-start text-left text-gray-700"
            onClick={async () => {
              const params = new URLSearchParams(searchParams);
              params.set('isUnassignStaffFlyoutOpen', 'true');
              params.set('staffId', id);

              router.replace(pathname + '?' + params.toString());
            }}
          >
            Un-Assign
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type StaffListProps = {
  scope?: 'class' | 'section';
};

export function StaffList({ scope }: StaffListProps) {
  const { classId, sectionId } = useParams<{ classId?: string; sectionId?: string }>();
  const effectiveScope = scope || (sectionId ? 'section' : 'class');

  const [viewMode, setViewMode] = useState<'card' | 'table' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storageKey = `rexdeia-view-mode-staff-${effectiveScope}`;
    const savedMode = localStorage.getItem(storageKey);
    if (savedMode === 'card' || savedMode === 'table' || savedMode === 'list') {
      setViewMode(savedMode);
    }
  }, [effectiveScope]);

  const handleViewModeChange = (mode: 'card' | 'table' | 'list') => {
    setViewMode(mode);
    localStorage.setItem(`rexdeia-view-mode-staff-${effectiveScope}`, mode);
  };

  const classQuery = useGetStaffListByClassIdQuery(classId || '', {
    enabled: effectiveScope === 'class' && !!classId,
  });

  const sectionQuery = useGetStaffListBySectionIdQuery(sectionId || '', {
    enabled: effectiveScope === 'section' && !!sectionId,
  });

  const staffListResponse = effectiveScope === 'class' ? classQuery.data : sectionQuery.data;
  const isLoading = effectiveScope === 'class' ? classQuery.isLoading : sectionQuery.isLoading;

  const filteredStaff = useMemo(() => {
    if (!staffListResponse) return [];
    if (!searchQuery.trim()) return staffListResponse;

    const q = searchQuery.toLowerCase().trim();
    return staffListResponse.filter((staffItem) => {
      const fullName = `${staffItem.firstName || ''} ${staffItem.middleName || ''} ${staffItem.lastName || ''}`
        .trim()
        .toLowerCase();
      const sections = (staffItem.sections || []).map((s) => s.name.toLowerCase()).join(' ');
      const subjects = (staffItem.subjects || []).map((sub) => sub.name.toLowerCase()).join(' ');
      return fullName.includes(q) || sections.includes(q) || subjects.includes(q);
    });
  }, [staffListResponse, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black">Fetching Staff List...</p>
      </div>
    );
  }

  if (!staffListResponse || staffListResponse.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-black">No Data Found</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* View Switcher Toolbar & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            Staffs ({filteredStaff.length})
          </span>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search staff name, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm border-gray-300 focus:border-indigo-500 rounded-md"
            />
          </div>
        </div>
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

      {filteredStaff.length === 0 ? (
        <div className="flex items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No staff match your search.</p>
        </div>
      ) : (
        <>
          {/* Grid / Card View */}
          {viewMode === 'card' && (
            <section className="grid w-full grid-cols-1 gap-4 px-0 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              {filteredStaff.map((staffItem) => (
                <StaffCard
                  key={staffItem.id}
                  id={staffItem.id}
                  name={`${staffItem.firstName || ''} ${staffItem.middleName || ''} ${staffItem.lastName || ''}`.trim()}
                  subjects={staffItem.subjects || []}
                  sectionsHandled={staffItem.sections || []}
                  sectionIncharge={staffItem.sectionIncharge || []}
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
                    <TableHead className="pl-4">Staff Name</TableHead>
                    <TableHead>Sections Handled (Subject)</TableHead>
                    <TableHead>Section Incharge</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staffItem) => {
                    const fullName = `${staffItem.firstName || ''} ${staffItem.middleName || ''} ${staffItem.lastName || ''}`.trim();
                    return (
                      <TableRow key={staffItem.id}>
                        <TableCell className="font-semibold pl-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
                              {staffItem.firstName?.charAt(0).toUpperCase() || 'S'}
                            </div>
                            {fullName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {staffItem.sections && staffItem.sections.length > 0 ? (
                              staffItem.sections.map((section, idx) => (
                                <div key={idx} className="inline-flex items-center gap-1">
                                  <span className="rounded bg-red-50 border border-red-200 px-1.5 py-0.5 text-xs font-medium text-red-800">
                                    {section.name}
                                  </span>
                                  {staffItem.subjects && staffItem.subjects[idx] && (
                                    <span className="text-xs text-gray-500">
                                      ({staffItem.subjects[idx]?.name})
                                    </span>
                                  )}
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs">No Sections</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {staffItem.sectionIncharge && staffItem.sectionIncharge.length > 0 ? (
                              staffItem.sectionIncharge.map((section) => (
                                <span
                                  key={section.id}
                                  className="rounded bg-green-100 border border-green-200 px-2 py-0.5 text-xs font-semibold text-green-800"
                                >
                                  {section.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <StaffActionsDropdown id={staffItem.id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="flex flex-col gap-2">
              {filteredStaff.map((staffItem) => {
                const fullName = `${staffItem.firstName || ''} ${staffItem.middleName || ''} ${staffItem.lastName || ''}`.trim();
                return (
                  <div
                    key={staffItem.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                        {staffItem.firstName?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{fullName}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                          <div className="inline-flex flex-wrap gap-1">
                            {staffItem.sections && staffItem.sections.length > 0 ? (
                              staffItem.sections.map((section, idx) => (
                                <span key={idx} className="text-gray-700 font-medium">
                                  {section.name}
                                  {staffItem.subjects && staffItem.subjects[idx] && (
                                    <span className="text-[10px] text-gray-400 ml-0.5 font-normal">
                                      ({staffItem.subjects[idx]?.name})
                                    </span>
                                  )}
                                </span>
                              ))
                            ) : (
                              <span>No Sections</span>
                            )}
                          </div>
                          {staffItem.sectionIncharge && staffItem.sectionIncharge.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="inline-flex gap-1">
                                Incharge:
                                {staffItem.sectionIncharge.map((section) => (
                                  <span key={section.id} className="text-green-700 font-bold">
                                    {section.name}
                                  </span>
                                ))}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <StaffActionsDropdown id={staffItem.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
