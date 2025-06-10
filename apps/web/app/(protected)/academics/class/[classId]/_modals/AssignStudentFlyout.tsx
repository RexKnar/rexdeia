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
  RadioGroup,
  RadioGroupItem,
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

export function AssignStudentFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sectionId } = useParams<{ sectionId: string }>();
  const isOpen = searchParams.get('isAssignStudentFlyoutOpen') === 'true';

  const { reset } = useForm();

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('isAssignStudentFlyoutOpen', 'false');
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
          className=" w-72 md:w-[28rem] lg:w-[32rem] px-4 py-6 bg-white"
          onCloseClick={() => closeFlyout()}
        >
          <SheetHeader>
            <SheetTitle className="mb-5">
              <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                <div className="flex items-center">
                  <PlusCircle size={20} strokeWidth={1.5} />
                  <Text variant="lg-semibold" className="ml-2">
                    Assign Student
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
                Student
              </label>
              <Select>
                <SelectTrigger className="w-full mt-2">
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
            {!sectionId && (
              <div className="mt-5">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Section
                </label>
                <Select>
                  <SelectTrigger className="w-full mt-2">
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
            )}
            <div className="mt-5">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Group
              </label>
              <Select>
                <SelectTrigger className="w-full mt-2">
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
                Medium
              </label>
              <Select>
                <SelectTrigger className="w-full mt-2">
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
            <div className="mt-7">
              <RadioGroup defaultValue="non-elective">
                <div className="flex">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="elective" />
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Elective
                    </label>
                  </div>
                  <div className="flex items-center ml-5 space-x-2">
                    <RadioGroupItem value="non-elective" />
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Non-Elective
                    </label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <div className="mt-10">
              <Button
                size="default"
                variant="default"
                className="flex justify-center px-12 py-4 mx-auto"
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
