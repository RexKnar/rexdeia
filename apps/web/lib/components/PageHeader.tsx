'use client';

import { useGetAllStaffListQuery } from 'lib/queries/staff/useGetAllStaffListQuery';
import { useGetStudentSearchListQuery } from 'lib/queries/students/useGetStudentSearchListQuery';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Alert, Text } from 'ui';
import { SidebarTrigger } from 'ui/components/ui/Sidebar';

import { NotificationPopover } from './notification/NotificationPopover';
import { UserMenu } from './UserMenu';

export function PageHeader() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pageSize = 9999;
  const searchRef = useRef(null);

  const searchEnabled = searchTerm.length >= 2;

  const {
    data: studentList,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useGetStudentSearchListQuery(
    { searchTerm, page, pageSize },
    {
      enabled: searchEnabled,
      refetchOnWindowFocus: false,
      staleTime: 10000,
    }
  );

  const {
    data: staffList,
    isLoading: isStaffLoading,
    error: staffError,
  } = useGetAllStaffListQuery(
    { page: 1, limit: 50, searchTerm },
    {
      enabled: searchEnabled,
      refetchOnWindowFocus: false,
      staleTime: 10000,
    }
  );

  const isLoading = isStudentsLoading || isStaffLoading;
  const error = studentsError || staffError;
  const students = studentList?.data ?? [];
  const staff = staffList?.data ?? [];
  const hasResults = students.length > 0 || staff.length > 0;

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setIsDropdownOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 flex h-[64px] w-full border border-b-gray-200 border-l-transparent bg-white print:hidden">
      <section className="mx-auto flex w-full items-center justify-between">
        <SidebarTrigger />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4" ref={searchRef}>
            <div className="relative">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search students & staff..."
                  className="h-9 w-64 rounded-md border border-gray-300 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setIsDropdownOpen(true)}
                />
                <Search
                  className="absolute right-2.5 top-2.5 text-gray-500"
                  size={16}
                />
              </div>

              {isDropdownOpen && searchEnabled && (
                <div className="absolute mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                    </div>
                  ) : error ? (
                    <Alert variant="destructive" className="m-2">
                      Something Went Wrong !
                    </Alert>
                  ) : !hasResults ? (
                    <div className="p-4 text-sm text-gray-500">
                      <Text variant="sm-medium"> No results found</Text>
                    </div>
                  ) : (
                    <div className="max-h-[400px] overflow-y-auto">
                      {/* Students */}
                      {students.length > 0 && (
                        <>
                          <div className="border-b bg-gray-50 p-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Students ({studentList?.total ?? students.length})
                          </div>
                          {students.map((student) => (
                            <Link
                              href={`/students/${student.id}`}
                              key={student.id}
                            >
                              <button
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                                    {student.firstName?.[0] ?? '?'}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      <Text variant="xs-medium">
                                        {student.firstName} {student.lastName}
                                      </Text>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {student?.studentMapping?.map(
                                        (academics, index) => (
                                          <span key={index}>
                                            <b>{academics?.class?.name}</b> -{' '}
                                            <b>{academics?.section?.name}</b>
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            </Link>
                          ))}
                        </>
                      )}

                      {/* Staff */}
                      {staff.length > 0 && (
                        <>
                          <div className="border-b border-t bg-gray-50 p-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Staff ({staffList?.total ?? staff.length})
                          </div>
                          {staff.map((member) => (
                            <Link href={`/staffs/${member.id}`} key={member.id}>
                              <button
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                    {member.firstName?.[0] ?? '?'}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      <Text variant="xs-medium">
                                        {member.firstName} {member.lastName}
                                      </Text>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {member.email || member.mobile || 'Staff'}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <NotificationPopover />
          <UserMenu />
        </div>
      </section>
    </header>
  );
}
