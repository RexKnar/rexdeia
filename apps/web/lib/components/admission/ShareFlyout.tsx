'use client';

import { CalendarIcon, Files } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  Button,
  Calendar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
} from 'ui';

import shareIcon from '../../../public/assets/images/shareIcon.svg';

export function ShareFlyout() {
  const [date, setDate] = useState<Date>();
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="mt-3 border-2 bg-blue-500 text-white"
          >
            Open Modal
          </Button>
        </SheetTrigger>
        <section className="p-2">
          <SheetContent side="right" widthSize="sm" className="bg-white">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Image
                      id="shareIcon"
                      src={shareIcon}
                      className="rounded-full bg-primary-100 p-2"
                      alt={'icon'}
                      width={35}
                      height={35}
                    ></Image>
                    <label
                      htmlFor="shareIcon"
                      className="ml-2 text-xs font-semibold"
                    >
                      Share
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Switch id="toggleSwitch" />
                    <label
                      htmlFor="toggleSwitch"
                      className="ml-2 text-xs font-semibold"
                    >
                      Inactive
                    </label>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <span className="border-b p-2"></span>
            <div>
              <div className="relative">
                <label
                  htmlFor="url"
                  className="text-sm font-normal text-gray-700"
                >
                  URL
                </label>
                <Input
                  id="url"
                  type="text"
                  className="mt-1 w-full border border-primary p-3 text-xs font-normal"
                  placeholder="https://www.figma.com/file/EdHp3URyXKDsPQzaAQVGDA"
                />
                <Files
                  size={18}
                  color="primary"
                  className="absolute right-3 -translate-y-7 transform"
                />
              </div>
            </div>
            <section className="mt-4 grid gap-7">
              <div className="grid justify-between gap-3 sm:grid-cols-1 md:grid-cols-2">
                <div className="w-full">
                  <Popover>
                    <label className="mb-1 text-xs font-normal text-gray-700">
                      Link Active From
                    </label>
                    <PopoverTrigger
                      asChild
                      className="rounded-md border border-primary-200 p-1.5"
                    >
                      <label className="flex justify-between text-sm font-normal text-gray-700">
                        02/10/2023
                        <CalendarIcon className="mr-2 h-4 w-4 justify-end" />
                      </label>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-full">
                  <Popover>
                    <label className="mb-1 text-xs font-normal text-gray-700">
                      Expires On
                    </label>
                    <PopoverTrigger
                      asChild
                      className="rounded-md border border-primary-200 p-1.5"
                    >
                      <label className="flex justify-between text-sm font-normal text-gray-700">
                        02/10/2023
                        <CalendarIcon className="mr-2 h-4 w-4 justify-end" />
                      </label>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex items-center">
                <Switch id="paymentAcceptToggle" />
                <label
                  htmlFor="paymentAcceptToggle"
                  className="ml-2 text-xs font-semibold"
                >
                  Accept payment for this form
                </label>
              </div>
              <div className="grid justify-between gap-3 sm:grid-cols-1 md:grid-cols-2">
                <div className="w-full">
                  <label
                    htmlFor="actualAmount"
                    className="text-xs font-normal text-gray-700"
                  >
                    Actual Amount
                  </label>
                  <Input
                    id="actualAmount"
                    type="text"
                    placeholder="₹"
                    className="mt-1 border border-primary-200 p-1"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="discountAmount"
                    className="text-xs font-normal text-gray-700"
                  >
                    Discount Amount
                  </label>
                  <Input
                    id="discountAmount"
                    type="text"
                    placeholder="₹"
                    className="mt-1 border border-primary-200 p-1"
                  />
                </div>
              </div>
              <div>
                <Button
                  size="lg"
                  variant="default"
                  className="mx-auto flex justify-center px-16 py-4 text-white"
                >
                  Save
                </Button>
              </div>
            </section>
          </SheetContent>
        </section>
      </Sheet>
    </>
  );
}
