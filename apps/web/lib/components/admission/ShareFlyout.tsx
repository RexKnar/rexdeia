'use client';

import { Text } from 'ui';

import shareIcon from '../../../public/assets/images/shareIcon.svg';
import Image from 'next/image';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Button,
  Calendar,
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
import { cn } from 'utils';

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

        <SheetContent side="right" widthSize="sm" className="bg-white">
          <div className="grid grid-cols-1 gap-4 p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src={shareIcon}
                  className="rounded-full bg-primary-100 p-2"
                  alt={'icon'}
                  width={35}
                  height={35}
                ></Image>
                <Text variant="sm-semibold" className="ml-1">
                  Share
                </Text>
              </div>
              <div>
                <div className="flex items-center justify-center">
                  <Switch />
                  <Text variant="xs-semibold" className="ml-2">
                    Inactive
                  </Text>
                </div>
              </div>
            </div>

            <div className="border-b p-1"></div>

            <div className="">
              <div>
                <Text variant="xs-regular" className="text-gray-700">
                  URL
                </Text>
                <input
                  type="text"
                  className="mt-2 w-full items-center rounded-md border border-primary p-3 text-xs font-normal"
                  placeholder="https://www.figma.com/file/EdHp3URyXKDsPQzaAQVGDA"
                />
              </div>
            </div>

            <div className="flex justify-between mt-3">
              <div>
              <Popover>
                <Text variant="xs-regular" className="text-gray-700 mb-1">
                  Link Active From
                </Text>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    02/10/2023
                    <CalendarIcon className="mr-2 h-4 w-4" />
                  </Button>
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

               <div>
              <Popover>
                <Text variant="xs-regular" className="text-gray-700 mb-1">
                  Expires On
                </Text>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    02/10/2023
                    <CalendarIcon className="mr-2 h-4 w-4" />
                  </Button>
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

            <div className="flex items-center mt-3">
              <Switch />
              <Text variant="xs-semibold" className="ml-2">
                Accept payment for this form
              </Text>
            </div>

            <div className="flex justify-between mt-3 gap-3">
              <div>
                <Text variant="xs-regular" className="text-gray-700">
                  Actual Amount
                </Text>
                <input
                  type="text"
                  placeholder="₹"
                  className="mt-1 items-center rounded-md border border-primary-200 p-1"
                />
              </div>
              <div>
                <Text variant="xs-regular" className="text-gray-700">
                  Discount Amount
                </Text>
                <input
                  type="text"
                  placeholder="₹"
                  className="mt-1 items-center rounded-md border border-primary-200 p-1"
                />
              </div>
            </div>

            <div>
              <Button
                size="lg"
                variant="default"
                className="mx-auto mt-5 flex items-center justify-center px-16 py-4 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
