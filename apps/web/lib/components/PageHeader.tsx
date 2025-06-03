'use client';

import { useGetStudentSearchListQuery } from 'lib/queries/students/useGetStudentSearchListQuery';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Alert, Text } from 'ui';

import { NotificationPopover } from './notification/NotificationPopover';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { UserMenu } from './UserMenu';

export function PageHeader() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pageSize = 9999;
  const searchRef = useRef(null);

  const {
    data: studentList,
    isLoading,
    error,
  } = useGetStudentSearchListQuery(
    { searchTerm, page, pageSize },
    {
      enabled: searchTerm.length >= 2,
      refetchOnWindowFocus: false,
      staleTime: 10000,
    }
  );

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
      <section className="flex items-center justify-between w-full mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <SidebarHeader />
        </Suspense>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4" ref={searchRef}>
            <div className="relative">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search students..."
                  className="w-64 px-3 pr-8 border border-gray-300 rounded-md h-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setIsDropdownOpen(true)}
                />
                <Search
                  className="absolute right-2.5 top-2.5 text-gray-500"
                  size={16}
                />
              </div>

              {isDropdownOpen && searchTerm.length >= 2 && (
                <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-spin border-t-blue-600" />
                    </div>
                  ) : error ? (
                    <Alert variant="destructive" className="m-2">
                      Something Went Wrong !
                    </Alert>
                  ) : studentList?.data?.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">
                      <Text variant="sm-medium"> No results found</Text>
                    </div>
                  ) : studentList?.data ? (
                    <div className="max-h-[400px] overflow-y-auto">
                      <div className="p-2 text-sm text-gray-600 border-b">
                        Found {studentList.total} results
                      </div>
                      {studentList.data.map((student) => (
                        <Link href={`/students/${student.id}`} key={student.id}>
                          <button
                            key={student.id}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                            onClick={() => {
                              setIsDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                                {student.firstName[0]}
                              </div>
                              <div>
                                <div className="font-medium">
                                  <Text variant="xs-medium">
                                    {student.firstName} {student.lastName}
                                  </Text>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {student?.studentMapping.map(
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
                    </div>
                  ) : null}
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
