'use client';

import { CircleMinus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  Checkbox,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from 'ui';

export function UnassignStaffFlyout() {
  const payload = [
    {
      staffid: 1,
      staffname: 'siva',
      sectionid: 1,
      sectionname: 'SectionA',
      subjects: ['Tamil', 'English'],
    },
    {
      staffid: 1,
      staffname: 'siva',
      sectionid: 2,
      sectionname: 'SectionB',
      subjects: ['Tamil', 'English'],
    },
  ];
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOpen = searchParams.get('isUnassignStaffFlyoutOpen') === 'true';

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isUnassignStaffFlyoutOpen', 'false');
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
              <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                <div className="flex items-center">
                  <CircleMinus size={20} strokeWidth={1.5} />
                  <Text variant="lg-semibold" className="ml-2">
                    Unassign Staff
                  </Text>
                </div>
              </div>
            </SheetTitle>
            <hr className="border-t border-gray-300"></hr>
          </SheetHeader>
          <div className="mt-6">
            <div>
              <Text variant="base-bold" className="text-gray-700">
                Staff Name
              </Text>
            </div>
            {payload.map((item) => (
              <div className="mt-2" key={item.sectionid}>
                <label
                  htmlFor="subjectName"
                  className="text-sm font-semibold text-gray-700"
                >
                  {item.sectionname}
                </label>
                <div className=" flex flex-wrap">
                  {item.subjects.map((subject) => (
                    <div
                      key={subject}
                      className="me-6 mt-2 flex flex-wrap items-center"
                    >
                      <Checkbox className="me-2 items-center space-x-2 rounded border border-primary-500" />
                      <label>{subject}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button
            type="submit"
            size="lg"
            variant="default"
            className=" mx-auto mt-8 flex justify-center px-12 py-4"
          >
            Remove
          </Button>
        </SheetContent>
      </Sheet>
    </section>
  );
}
