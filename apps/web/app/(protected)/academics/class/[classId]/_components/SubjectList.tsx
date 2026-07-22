/* eslint-disable prettier/prettier */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, List, Table as TableIcon, MoreHorizontal, Loader2, Search, BookOpen } from 'lucide-react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

import { SubjectCard } from '../../../../../../lib/components/subjectcard/SubjectCard';
import { useGetSubjectListByClassIdQuery } from '../../../../../../lib/queries/subjects/useGetSubjectListByClassIdQuery';
import { useGetSubjectListBySectionIdQuery } from '../../../../../../lib/queries/subjects/useGetSubjectListBySectionIdQuery';

function SubjectActionsDropdown({ id, name }: { id: string; name: string }) {
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
        <DropdownMenuItem className="flex items-center cursor-pointer">
          <Button
            variant="link"
            size="sm"
            className="flex-1 justify-start text-left text-gray-700"
            onClick={async () => {
              const params = new URLSearchParams(searchParams);
              params.set('isAssignSubjectToStudentFlyout', 'true');
              params.set('subjectId', id);
              params.set('subjectName', name);
              router.replace(pathname + '?' + params.toString());
            }}
          >
            Assign elective
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="text-gray-500 bg-gray-100" />
        <DropdownMenuItem className="flex items-center cursor-pointer">
          <Button
            variant="link"
            size="sm"
            className="flex-1 justify-start text-left text-gray-700"
            onClick={async () => {
              const params = new URLSearchParams(searchParams);
              params.set('isAddSubjectFlyoutOpen', 'true');
              params.set('subjectId', id);

              router.replace(pathname + '?' + params.toString());
            }}
          >
            Edit
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="text-gray-500 bg-gray-100" />
        <DropdownMenuItem className="flex items-center cursor-pointer">
          <Button
            variant="link"
            size="sm"
            className="flex-1 justify-start text-left text-red-600 hover:text-red-800"
            onClick={async () => {
              const params = new URLSearchParams(searchParams);
              params.set('isDeleteConfirmationModalOpen', 'true');
              params.set('subjectId', id);
              params.set('subjectName', name);
              router.replace(pathname + '?' + params.toString());
            }}
          >
            Remove
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type SubjectListProps = {
  scope?: 'class' | 'section';
};

export function SubjectList({ scope }: SubjectListProps) {
  const { classId, sectionId } = useParams<{ classId?: string; sectionId?: string }>();
  const effectiveScope = scope || (sectionId ? 'section' : 'class');

  const [viewMode, setViewMode] = useState<'card' | 'table' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storageKey = `rexdeia-view-mode-subjects-${effectiveScope}`;
    const savedMode = localStorage.getItem(storageKey);
    if (savedMode === 'card' || savedMode === 'table' || savedMode === 'list') {
      setViewMode(savedMode);
    }
  }, [effectiveScope]);

  const handleViewModeChange = (mode: 'card' | 'table' | 'list') => {
    setViewMode(mode);
    localStorage.setItem(`rexdeia-view-mode-subjects-${effectiveScope}`, mode);
  };

  const classQuery = useGetSubjectListByClassIdQuery(classId || '', {
    enabled: effectiveScope === 'class' && !!classId,
  });

  const sectionQuery = useGetSubjectListBySectionIdQuery(sectionId || '', classId, {
    enabled: effectiveScope === 'section' && !!sectionId,
  });

  const isLoading = effectiveScope === 'class' ? classQuery.isLoading : sectionQuery.isLoading;

  const rawGroups = useMemo(() => {
    if (effectiveScope === 'class') {
      if (!classQuery.data) return [];
      return [{ id: 'all-subjects', name: '', subject: classQuery.data }];
    } else {
      if (!sectionQuery.data) return [];
      return sectionQuery.data;
    }
  }, [effectiveScope, classQuery.data, sectionQuery.data]);

  const filteredGroups = useMemo(() => {
    if (!rawGroups) return [];
    if (!searchQuery.trim()) return rawGroups;

    const q = searchQuery.toLowerCase().trim();
    return rawGroups
      .map((group) => {
        const matchesGroup = group.name ? group.name.toLowerCase().includes(q) : false;
        const matchingSubjects = (group.subject || []).filter((s) =>
          s.name.toLowerCase().includes(q)
        );
        if (matchesGroup) {
          return group;
        }
        if (matchingSubjects.length > 0) {
          return {
            ...group,
            subject: matchingSubjects,
          };
        }
        return null;
      })
      .filter(Boolean) as typeof rawGroups;
  }, [rawGroups, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-6 h-6 mr-2 text-black animate-spin" />
        <p className="text-black">Fetching Subject List...</p>
      </div>
    );
  }

  const totalSubjectCount = filteredGroups.reduce((acc, g) => acc + (g.subject ? g.subject.length : 0), 0);

  if (rawGroups.length === 0 || (effectiveScope === 'class' && !classQuery.data?.length)) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-black">No Data Found</p>
      </div>
    );
  }

  const getStaffList = (subject: any) => {
    return (subject.academicSubjectForStaff || []).map((staff: any) => {
      const { firstName, middleName, lastName } = staff.staff;
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
      const sectionName = staff.section?.name;
      return {
        fullName,
        sectionName,
        text: sectionName ? `${fullName} (${sectionName})` : fullName,
      };
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* View Switcher Toolbar & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            Subjects ({totalSubjectCount})
          </span>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search subject name..."
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

      {totalSubjectCount === 0 ? (
        <div className="flex items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No subjects match your search.</p>
        </div>
      ) : (
        <section className="w-full flex flex-col gap-6">
          {filteredGroups.map((group) => (
            <div className="flex flex-col gap-3" key={group.id}>
              {group.name && (
                <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
                  <span className="text-base font-bold text-gray-800">{group.name}</span>
                  <span className="text-xs text-gray-500 font-medium">({group.subject.length})</span>
                </div>
              )}

              {/* Grid / Card View */}
              {viewMode === 'card' && (
                <section className="justify-between w-full gap-4 px-0 md:grid md:grid-cols-4 sm:grid sm:grid-cols-1">
                  {group.subject.map((subject) => (
                    <div key={subject.id} className="w-auto">
                      <SubjectCard
                        id={subject.id}
                        name={subject.name}
                        staffNames={getStaffList(subject).map(s => s.text).join(', ')}
                      />
                    </div>
                  ))}
                </section>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="pl-4">Subject Name</TableHead>
                        {effectiveScope === 'class' ? (
                          <TableHead>Assigned Staff (Section)</TableHead>
                        ) : (
                          <TableHead>Group Name</TableHead>
                        )}
                        <TableHead className="text-right pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.subject.map((subject) => {
                        const staffInfoList = getStaffList(subject);
                        return (
                          <TableRow key={subject.id}>
                            <TableCell className="font-semibold pl-4">
                              <div className="flex items-center gap-2">
                                <BookOpen size={16} className="text-indigo-500" />
                                {subject.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              {effectiveScope === 'class' ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {staffInfoList.length > 0 ? (
                                    staffInfoList.map((staff, idx) => (
                                      <span
                                        key={idx}
                                        className="rounded bg-teal-50 border border-teal-200 px-2 py-0.5 text-xs font-medium text-teal-800"
                                      >
                                        {staff.text}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-gray-400 text-xs">No Staff Assigned</span>
                                  )}
                                </div>
                              ) : (
                                <span className="rounded bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-xs font-medium text-indigo-700">
                                  {group.name}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <SubjectActionsDropdown id={subject.id} name={subject.name} />
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
                  {group.subject.map((subject) => {
                    const staffInfoList = getStaffList(subject);
                    return (
                      <div
                        key={subject.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                            {effectiveScope === 'class' ? (
                              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                {staffInfoList.length > 0 ? (
                                  staffInfoList.map((staff, idx) => (
                                    <span
                                      key={idx}
                                      className="rounded bg-teal-50 border border-teal-200 px-1.5 py-0.2 text-[10px] font-medium text-teal-800"
                                    >
                                      {staff.text}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-400 text-xs">No Staff Assigned</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-indigo-600 font-medium">Group: {group.name}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <SubjectActionsDropdown id={subject.id} name={subject.name} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
