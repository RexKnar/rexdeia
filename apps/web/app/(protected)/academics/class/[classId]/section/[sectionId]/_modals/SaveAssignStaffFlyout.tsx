'use client';

import { PlusCircle, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Avatar,
  AvatarImage,
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from 'ui';

export function SaveAssignStaffFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const [staffList, setStaffList] = useState([
    { id: 1, name: 'John Doe', photo: '/john-doe.jpg', isAssigned: false },
    { id: 2, name: 'Jane Smith', photo: '/jane-smith.jpg', isAssigned: false },
    { id: 3, name: 'John Doe', photo: '/john-doe.jpg', isAssigned: false },
    { id: 4, name: 'Jane Smith', photo: '/jane-smith.jpg', isAssigned: false },
  ]);
  const filteredStaff = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isOpen = searchParams.get('isSaveAssignStaffFlyoutOpen') === 'true';

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isSaveAssignStaffFlyoutOpen', 'false');
    params.delete('sectionId');

    router.replace(pathname + '?' + params.toString());
  };

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent 
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeFlyout()}
        >
          <SheetHeader>
            <SheetTitle>
              <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                <div className="flex items-center">
                  <PlusCircle size={20} strokeWidth={1.5} />
                  <Text variant="lg-semibold" className="ml-2">
                    Assign Staff
                  </Text>
                </div>
              </div>
            </SheetTitle>
            <hr className="border-t border-gray-300"></hr>
          </SheetHeader>

          <div className="mt-5">
            <div>
              <label
                htmlFor="sectionName"
                className=" text-sm font-semibold text-gray-700"
              >
                Search staff
              </label>
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="staff name"
                  className="mb-4 mt-2 w-full rounded-lg border border-gray-300 p-2"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pb-6 pr-3">
                  <Search className="text-primary-200" size={20} />
                </div>
              </div>
            </div>
            <div>
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="mb-2 flex items-center  border bg-gray-100"
                >
                  <Avatar className="ml-3 h-12 w-12 cursor-pointer ">
                    <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">{staff.name}</p>
                  </div>
                  <div className="ml-auto">
                    <Button
                      variant={staff.isAssigned ? 'default' : 'outline'}
                      className="mb-4 mr-4 mt-4 rounded-lg "
                      onClick={() => {
                        setStaffList((prevStaffList) =>
                          prevStaffList.map((prevStaff) =>
                            prevStaff.id === staff.id
                              ? { ...prevStaff, isAssigned: true }
                              : prevStaff
                          )
                        );
                      }}
                    >
                      {staff.isAssigned ? 'Assigned' : 'Assign'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16">
            <Button
              size="lg"
              variant="default"
              className="mx-auto flex justify-center px-12 py-4"
              onClick={() => closeFlyout}
            >
              Save & Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
