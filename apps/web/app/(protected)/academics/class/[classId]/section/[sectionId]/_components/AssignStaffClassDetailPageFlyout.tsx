'use client';

import { Plus, PlusCircle, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from 'ui';

export function AssignStaffClassDetailPageFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOpen =
    searchParams.get('isAssignStaffClassDetailPageFlyoutOpen') === 'true';

  const { reset } = useForm();

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('isAssignStaffClassDetailPageFlyoutOpen', 'false');
    params.delete('sectionId');
    reset();
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
            <SheetTitle className="mb-5">
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
          <div className="mt-5 flex gap-4">
            <div>
              <label
                htmlFor="searchStaff"
                className="text-sm font-semibold text-gray-700"
              >
                Search staff
              </label>
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Staff name"
                  className="mb-4 mt-2 w-full rounded-lg border border-gray-300 p-2"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pb-6 pr-3">
                  <Search className="text-primary-200" size={20} />
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="subjectName"
                className="text-sm font-semibold text-gray-700"
              >
                Subject Name
              </label>
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Subject"
                  className="mb-4 mt-2 w-full rounded-lg border border-gray-300 p-2"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pb-6 pr-3">
                  <Search className="text-primary-200" size={20} />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <Button variant="default">
                <Plus size={20} />
              </Button>
            </div>
          </div>
          <div className="mt-5">
            <label
              htmlFor="subjectName"
              className="text-sm font-semibold text-gray-700"
            >
              Section
            </label>
          </div>
          <div className="mt-5">
            <label
              htmlFor="subjectName"
              className="text-sm font-semibold text-gray-700"
            >
              Class Incharge
            </label>
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
