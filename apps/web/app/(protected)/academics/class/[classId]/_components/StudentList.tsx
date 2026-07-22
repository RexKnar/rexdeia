'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  LayoutGrid,
  List,
  Table as TableIcon,
  MoreHorizontal,
  Loader2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
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

import { useGetStudentListByClassIdQuery } from '../../../../../../lib/queries/students/useGetStudentListByClassIdQuery';
import { useGetStudentListBySectionIdQuery } from '../../../../../../lib/queries/students/useGetStudentListBySectionIdQuery';
import { ArchiveStudentFlyout } from '../_modals/ArchiveStudentFlyout';
import { VerifyStudentListModal } from '../_modals/VerifyStudentListModal';
import { StudentCard } from '../section/[sectionId]/_components/StudentCard';
import { ReassignStudentFlyout } from '../section/[sectionId]/_modals/ReassignStudentFlyout';

function StudentActionsDropdown({ id, name, sectionId }: { id: string; name: string; sectionId?: string }) {
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
        <DropdownMenuItem className="flex cursor-pointer items-center">
          <span className="flex-1">
            <Link href={`/students/${id}/editStudent`}>Edit</Link>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center">
          <span className="flex-1">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('isReassignStudentFlyoutOpen', 'true');
                params.set('studentId', id);
                if (sectionId) params.set('sectionId', sectionId);

                router.replace(pathname + '?' + params.toString());
              }}
            >
              Re-Assign
            </button>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center">
          <span className="flex-1">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('isArchiveStudentFlyoutOpen', 'true');
                params.set('studentId', id);
                if (sectionId) params.set('sectionId', sectionId);

                router.replace(pathname + '?' + params.toString());
              }}
            >
              Archive/Transfer
            </button>
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type StudentListProps = {
  scope?: 'class' | 'section';
};

export function StudentList({ scope }: StudentListProps) {
  const { classId, sectionId } = useParams<{ classId?: string; sectionId?: string }>();
  const effectiveScope = scope || (sectionId ? 'section' : 'class');

  const [viewMode, setViewMode] = useState<'card' | 'table' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'emisNumber' | 'admissionNumber' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  useEffect(() => {
    const storageKey = `rexdeia-view-mode-students-${effectiveScope}`;
    const savedMode = localStorage.getItem(storageKey);
    if (savedMode === 'card' || savedMode === 'table' || savedMode === 'list') {
      setViewMode(savedMode);
    }
  }, [effectiveScope]);

  const handleViewModeChange = (mode: 'card' | 'table' | 'list') => {
    setViewMode(mode);
    localStorage.setItem(`rexdeia-view-mode-students-${effectiveScope}`, mode);
  };

  const classQuery = useGetStudentListByClassIdQuery(classId || '', {
    enabled: effectiveScope === 'class' && !!classId,
  });

  const sectionQuery = useGetStudentListBySectionIdQuery(sectionId || '', {
    enabled: effectiveScope === 'section' && !!sectionId,
  });

  const studentListResponse = effectiveScope === 'class' ? classQuery.data : sectionQuery.data;
  const isLoading = effectiveScope === 'class' ? classQuery.isLoading : sectionQuery.isLoading;

  const handleSort = (field: 'name' | 'emisNumber' | 'admissionNumber') => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortField(null);
        setSortOrder('asc');
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: 'name' | 'emisNumber' | 'admissionNumber') => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="ml-1 text-gray-400 opacity-60 hover:opacity-100" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} className="ml-1 text-indigo-600 font-bold" />
    ) : (
      <ArrowDown size={14} className="ml-1 text-indigo-600 font-bold" />
    );
  };

  const openStudentDetailsInNewTab = (studentId: string) => {
    window.open(`/students/${studentId}`, '_blank', 'noopener,noreferrer');
  };

  const filteredStudents = useMemo(() => {
    if (!studentListResponse) return [];
    let list = [...studentListResponse];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((student) => {
        const fullName = [student.firstName, student.middleName, student.lastName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        const adm = (student.admissionNumber || '').toLowerCase();
        const emis = (student.emisNumber || '').toLowerCase();
        const section = (student.section?.name || '').toLowerCase();
        const gender = (student.gender || '').toLowerCase();
        const email = (student.emailId || '').toLowerCase();
        return (
          fullName.includes(q) ||
          adm.includes(q) ||
          emis.includes(q) ||
          section.includes(q) ||
          gender.includes(q) ||
          email.includes(q)
        );
      });
    }

    if (sortField) {
      list.sort((a, b) => {
        let aVal = '';
        let bVal = '';
        if (sortField === 'name') {
          aVal = [a.firstName, a.middleName, a.lastName].filter(Boolean).join(' ');
          bVal = [b.firstName, b.middleName, b.lastName].filter(Boolean).join(' ');
        } else if (sortField === 'emisNumber') {
          aVal = a.emisNumber || '';
          bVal = b.emisNumber || '';
        } else if (sortField === 'admissionNumber') {
          aVal = a.admissionNumber || '';
          bVal = b.admissionNumber || '';
        }

        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
        return sortOrder === 'asc' ? cmp : -cmp;
      });
    }

    return list;
  }, [studentListResponse, searchQuery, sortField, sortOrder]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black">Fetching Student List...</p>
      </div>
    );
  }

  if (!studentListResponse || studentListResponse.length === 0) {
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
            Students ({filteredStudents.length})
          </span>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search name, EMIS, admission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm border-gray-300 focus:border-indigo-500 rounded-md"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Verify Student List Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVerifyModalOpen(true)}
            className="flex items-center gap-1.5 border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 font-semibold h-9 text-xs"
          >
            <ShieldCheck size={16} className="text-indigo-600" />
            <span>Verify List & CSV Audit</span>
          </Button>

          {/* View Toggle */}
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
      </div>

      {filteredStudents.length === 0 ? (
        <div className="flex items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No students match your search.</p>
        </div>
      ) : (
        <>
          {/* Grid / Card View */}
          {viewMode === 'card' && (
            <section className="grid w-full grid-cols-1 justify-between gap-4 px-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStudents.map((studentItem) => (
                <div key={studentItem.id}>
                  <StudentCard id={studentItem.id} name={studentItem.firstName} />
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
                    <TableHead className="w-[140px] pl-4">
                      <button
                        className="flex items-center hover:text-indigo-600 focus:outline-none"
                        onClick={() => handleSort('admissionNumber')}
                      >
                        Admission No {renderSortIcon('admissionNumber')}
                      </button>
                    </TableHead>
                    <TableHead className="w-[140px]">
                      <button
                        className="flex items-center hover:text-indigo-600 focus:outline-none"
                        onClick={() => handleSort('emisNumber')}
                      >
                        EMIS No {renderSortIcon('emisNumber')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        className="flex items-center hover:text-indigo-600 focus:outline-none"
                        onClick={() => handleSort('name')}
                      >
                        Student Name {renderSortIcon('name')}
                      </button>
                    </TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((studentItem) => {
                    const fullName = [studentItem.firstName, studentItem.middleName, studentItem.lastName]
                      .filter(Boolean)
                      .join(' ');
                    return (
                      <TableRow
                        key={studentItem.id}
                        onClick={() => openStudentDetailsInNewTab(studentItem.id)}
                        className="cursor-pointer hover:bg-indigo-50/40 transition-colors group"
                      >
                        <TableCell className="font-mono text-sm pl-4">
                          {studentItem.admissionNumber || 'N/A'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {studentItem.emisNumber || 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium">
                          <a
                            href={`/students/${studentItem.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 group-hover:text-indigo-600 transition-colors"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
                              {studentItem.firstName?.charAt(0).toUpperCase() || 'S'}
                            </div>
                            <span className="font-semibold">{fullName}</span>
                          </a>
                        </TableCell>
                        <TableCell>{studentItem.gender || 'N/A'}</TableCell>
                        <TableCell>{studentItem.emailId || 'N/A'}</TableCell>
                        <TableCell>
                          {studentItem.section?.name ? (
                            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                              {studentItem.section.name}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <StudentActionsDropdown
                            id={studentItem.id}
                            name={studentItem.firstName}
                            sectionId={(studentItem as any).sectionId || (studentItem.section as any)?.id || sectionId}
                          />
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
              {filteredStudents.map((studentItem) => {
                const fullName = [studentItem.firstName, studentItem.middleName, studentItem.lastName]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <div
                    key={studentItem.id}
                    onClick={() => openStudentDetailsInNewTab(studentItem.id)}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                        {studentItem.firstName?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div>
                        <a
                          href={`/students/${studentItem.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors"
                        >
                          {fullName}
                        </a>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-gray-500">
                          <span>Admn: {studentItem.admissionNumber || 'N/A'}</span>
                          <span>•</span>
                          <span>EMIS: {studentItem.emisNumber || 'N/A'}</span>
                          <span>•</span>
                          <span>{studentItem.gender || 'N/A'}</span>
                          {studentItem.section?.name && (
                            <>
                              <span>•</span>
                              <span className="font-medium text-indigo-600">Sec: {studentItem.section.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <StudentActionsDropdown
                        id={studentItem.id}
                        name={studentItem.firstName}
                        sectionId={(studentItem as any).sectionId || (studentItem.section as any)?.id || sectionId}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Flyouts & Verification Modal */}
      <VerifyStudentListModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        systemStudents={studentListResponse}
      />
      <ReassignStudentFlyout />
      <ArchiveStudentFlyout />
    </div>
  );
}
