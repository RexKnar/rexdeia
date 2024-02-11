'use client';

import { PlusCircle } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
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

export function AddSubjectFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ sectionId: string }>();
  const isOpen = searchParams.get('isAddSubjectFlyoutOpen') === 'true';

  const { reset } = useForm();

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('isAddSubjectFlyoutOpen', 'false');
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
                    New Subject
                  </Text>
                </div>
              </div>
            </SheetTitle>
            <hr className="border-t border-gray-300"></hr>
          </SheetHeader>
          <div className="mt-5">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Subject Name
              </label>
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
            </div>
            {!params.sectionId && (
              <div className="mt-5">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Section
                </label>
              </div>
            )}
            <div className="mt-5">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Acadamic Year
              </label>
              <Select>
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="2015-2016">2015-2016</SelectItem>
                    <SelectItem value="2016-2017">2016-2017</SelectItem>
                    <SelectItem value="2017-2018">2017-2018</SelectItem>
                    <SelectItem value="2018-2019">2018-2019</SelectItem>
                    <SelectItem value="2019-2020">2019-2020</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-5">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Subject Type
              </label>
              <Select>
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Practical">Practical</SelectItem>
                    <SelectItem value="Theory">Theory</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-5">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Subject Format
              </label>
            </div>
            <div className="mt-10 flex justify-center ">
              <Button
                size="default"
                variant="outline"
                className="flex justify-center px-4 py-4"
              >
                Save & add new
              </Button>
              <Button
                size="default"
                variant="default"
                className="ml-3 flex justify-center px-4 py-4"
              >
                Save & Close
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
