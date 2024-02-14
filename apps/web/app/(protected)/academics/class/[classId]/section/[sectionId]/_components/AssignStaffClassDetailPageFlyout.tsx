'use client';

import { PlusCircle, Search, Trash } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  const { control } = useForm();

  const isOpen =
    searchParams.get('isAssignStaffClassDetailPageFlyoutOpen') === 'true';

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'section',
  });

  useEffect(() => {
    if (isOpen && fields.length === 0) {
      append({ section: 'section' });
    }
  }, [isOpen, fields, append]);

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
              <div className="flex items-center">
                <PlusCircle size={20} strokeWidth={1.5} />
                <Text variant="lg-semibold" className="ml-2">
                  Assign Staff
                </Text>
              </div>
            </SheetTitle>
            <hr className="border-t border-gray-300" />
          </SheetHeader>
          <div className="mt-8">
            {fields.map((row, index) => (
              <section key={row.id}>
                <div className="mt-5 flex gap-4">
                  <div className="w-full">
                    <label
                      htmlFor="searchStaff"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Search staff
                    </label>
                    <div className="relative w-full">
                      <Select>
                        <SelectTrigger className="mt-2 w-full" key={index}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Staff-1">Staff-1</SelectItem>
                            <SelectItem value="Staff-2">Staff-2</SelectItem>
                            <SelectItem value="Staff-3">Staff-3</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <Search className="text-primary-200" size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="subjectName"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Subject Name
                    </label>
                    <div className="relative w-full">
                      <Select>
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Tamil">Tamil</SelectItem>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Maths">Maths</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <Search className="text-primary-200" size={20} />
                      </div>
                    </div>
                  </div>
                  {fields.length > 1 ? (
                    <div className="mt-8">
                      <Button
                        className="border-transparent bg-red-600 px-2"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        <Trash size={20} className="text-center text-white" />
                      </Button>
                    </div>
                  ) : null}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="subjectName"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Section
                  </label>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="space-x-2">
                      <Checkbox id="section-A" />
                      <label
                        htmlFor="section-1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Section A
                      </label>
                    </div>
                    <div className="space-x-2">
                      <Checkbox id="section-B" />
                      <label
                        htmlFor="section-1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Section B
                      </label>
                    </div>
                    <div className="space-x-2">
                      <Checkbox id="section-C" />
                      <label
                        htmlFor="section-1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Section C
                      </label>
                    </div>
                    <div className="space-x-2">
                      <Checkbox id="section-D" />
                      <label
                        htmlFor="section-1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Section D
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-1">
                  <label
                    htmlFor="subjectName"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Class Incharge
                  </label>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="space-x-2">
                      <Checkbox id="section-A" />
                      <label
                        htmlFor="section-1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Section A
                      </label>
                    </div>
                    <div className="space-x-2">
                      <Checkbox id="section-B" />
                      <label
                        htmlFor="section-1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Section B
                      </label>
                    </div>
                    <div className="space-x-2">
                      <Checkbox id="section-C" />
                      <label
                        htmlFor="section-1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Section C
                      </label>
                    </div>
                    <div className="space-x-2">
                      <Checkbox id="section-D" />
                      <label
                        htmlFor="section-1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Section D
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
          <div className="mt-5">
            <Button
              size="sm"
              variant="outline"
              className="mx-auto flex justify-center px-4 py-2"
              onClick={() => {
                append({ section: 'section' });
              }}
            >
              <Text variant="sm-bold" className="text-center text-primary">
                Add New
              </Text>
            </Button>
          </div>
          <div className="mt-16">
            <Button
              size="lg"
              variant="default"
              className="mx-auto flex justify-center px-12 py-4"
              onClick={() => closeFlyout()}
            >
              Save & Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
