'use client';

import { useGetStudentSearchListQuery } from 'lib/queries/students/useGetStudentSearchListQuery';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { Avatar, AvatarImage, Input, Text } from 'ui';

import { NotificationPopover } from './notification/NotificationPopover';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { UserMenu } from './UserMenu';

export function PageHeader() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const pageSize = 5;

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    setIsSearchActive(true);
  }, [studentList]);

  return (
    <header className="sticky top-0 z-50 flex h-[64px] w-full  border border-b-gray-200 border-l-transparent bg-white print:hidden ">
      <section className="mx-auto flex w-full items-center justify-between ">
        <Suspense fallback={<div>Loading...</div>}>
          <SidebarHeader />
        </Suspense>

        <div className="flex items-center gap-6">
          <div className="relative hidden items-center lg:flex">
            <div>
              <Input
                type="search"
                placeholder="Search"
                className="group h-8 w-auto bg-gray-50 placeholder:text-gray-800 md:w-80"
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={() => setIsSearchActive(false)}
              />
              <div className="absolute right-3 top-10 text-gray-600 group-active:block md:w-80">
                {studentList && isSearchActive && (
                  <section className="w-full bg-white group-active:block">
                    {studentList && (
                      <div>
                        <p>Total results: {studentList.total}</p>
                        {isLoading && <p>Loading...</p>}
                        {error && <p>Error: {(error as Error).message}</p>}
                        {studentList.data.map((student) => {
                          return (
                            <div
                              className="cursor-pointer border-b-2 py-1"
                              key={student.id}
                            >
                              <Link href={`/students/${student.id}`}>
                                <div className="flex items-center px-4 py-3">
                                  <Avatar>
                                    <AvatarImage src="assets/images/male-avatar.png" />
                                  </Avatar>
                                  <div className="pl-2">
                                    <Text variant="sm-medium">
                                      {student?.firstName || ''}
                                      {student?.lastName || ''}
                                    </Text>
                                    <Text
                                      variant="xs-regular"
                                      className="text-gray-800"
                                    >
                                      {student?.studentMapping.map(
                                        (academics) => {
                                          return (
                                            <>
                                              <b>{academics?.class?.name}</b> -
                                              <b>{academics?.section?.name}</b>
                                            </>
                                          );
                                        }
                                      )}
                                    </Text>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}

                        {/* Add pagination controls here */}
                      </div>
                    )}
                  </section>
                )}
              </div>
            </div>
            <Search className="absolute right-3 text-gray-600" size={16} />
          </div>
          <NotificationPopover />
          <UserMenu />
        </div>
      </section>
    </header>
  );
}
