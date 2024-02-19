'use client';

import { PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
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
  Switch,
  Text,
} from 'ui';

export function ExamConfigureFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isExamConfigureFlyoutOpen') === 'true';
  const { reset, setValue } = useForm();
  const [practical, setPractical] = useState(false);
  const [theory, setTheory] = useState(true);

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isExamConfigureFlyoutOpen', 'false');
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
          <div className="max-h-[95vh] overflow-y-auto">
            <form>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        Exam Configuration
                      </Text>
                    </div>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300"></hr>
              </SheetHeader>
              <div className="mt-5">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold">
                    Subject Name
                  </label>
                </div>
                <label
                  htmlFor="totalmark"
                  className="text-sm font-semibold text-gray-700"
                >
                  Total mark
                </label>
                <Input
                  id="name"
                  autoFocus
                  type="text"
                  className="mt-2"
                  placeholder="Total mark"
                />
                <label
                  htmlFor="marktoconduct"
                  className="text-sm font-semibold text-gray-700"
                >
                  Mark to Conduct
                </label>
                <Input
                  id="name"
                  type="text"
                  className="mt-2"
                  placeholder="Mark to Conduct"
                />
                <label
                  htmlFor="minpassMark"
                  className="text-sm font-semibold text-gray-700"
                >
                  Min Pass Mark
                </label>
                <Input
                  id="name"
                  type="text"
                  className="mt-2"
                  placeholder="Min Pass Mark"
                />
                <div className="mt-1 flex justify-end">
                  <label className="text-sm font-medium text-gray-600">
                    From conducting mark
                  </label>
                </div>
                <label
                  htmlFor="minpassMark"
                  className="text-sm font-semibold text-gray-700"
                >
                  Grade
                </label>
                <Select>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="O">O</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-5 flex items-center justify-around">
                <div className="flex items-center">
                  <Switch
                    id="theory"
                    checked={theory}
                    onCheckedChange={(value) => {
                      setTheory(value);
                      setValue('theory', value);
                    }}
                  />
                  <label
                    htmlFor="theory"
                    className="ml-2 text-sm font-semibold"
                  >
                    Theory
                  </label>
                </div>
                <div className="flex items-center">
                  <Switch
                    id="practical"
                    onCheckedChange={(value) => {
                      setPractical(value);
                      setValue('practical', value);
                    }}
                  />
                  <label
                    htmlFor="practical"
                    className="ml-2 text-sm font-semibold"
                  >
                    Practical
                  </label>
                </div>
              </div>
              {theory && (
                <div className="mt-5">
                  <div>
                    <label htmlFor="name" className="text-sm font-semibold">
                      Theory
                    </label>
                  </div>
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Marks to conduct
                  </label>
                  <Input
                    id="name"
                    autoFocus
                    type="text"
                    className="mt-2"
                    placeholder="Marks to conduct"
                  />
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Convert Mark to
                  </label>
                  <Input
                    id="name"
                    type="text"
                    className="mt-2"
                    placeholder="Convert Mark to"
                  />
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Min Pass Mark
                  </label>
                  <Input
                    id="name"
                    type="text"
                    className="mt-2"
                    placeholder="Min Pass Mark"
                  />
                  <div className="mt-1 flex justify-end">
                    <label className="text-sm font-medium text-gray-600">
                      From conducting mark
                    </label>
                  </div>
                </div>
              )}
              {practical && (
                <div className="mt-5">
                  <div>
                    <label htmlFor="name" className="text-sm font-semibold">
                      Practical
                    </label>
                  </div>
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Marks to conduct
                  </label>
                  <Input
                    id="name"
                    autoFocus
                    type="text"
                    className="mt-2"
                    placeholder="Marks to conduct"
                  />
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Convert Mark to
                  </label>
                  <Input
                    id="name"
                    type="text"
                    className="mt-2"
                    placeholder="Convert Mark to"
                  />
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Min Pass Mark
                  </label>
                  <Input
                    id="name"
                    type="text"
                    className="mt-2"
                    placeholder="Min Pass Mark"
                  />
                  <div className="mt-1 flex justify-end">
                    <label className="text-sm font-medium text-gray-600">
                      From conducting mark
                    </label>
                  </div>
                </div>
              )}
              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  className="mx-auto flex justify-center px-12 py-4"
                  onClick={() => closeFlyout()}
                >
                  Save & Close
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
