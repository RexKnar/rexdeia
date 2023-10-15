'use client';

import { Text, Button, Sheet, SheetContent, SheetTrigger } from 'ui';

import shareIcon from '../../../public/assets/images/shareIcon.svg';
import Image from 'next/image';

export function ShareFlyout() {
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
          <div className="grid grid-cols-1 gap-2 p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center">
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
                <div className="relative mt-1 inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    value=""
                    className="peer sr-only"
                  ></input>
                  <div className="peer h-5 w-9 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                  <Text variant="xs-semibold" className="ml-2">
                    Inactive
                  </Text>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div>
                <Text variant="xs-regular" className="text-gray-700">
                  URL
                </Text>
                <input
                  type="text"
                  className="border-1 mt-2 w-full items-center rounded-md border border-primary p-3 text-xs font-normal"
                  placeholder="https://www.figma.com/file/EdHp3URyXKDsPQzaAQVGDA"
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between">
                <div date-rangepicker className="flex items-center gap-3">
                  <div className="relative">
                    <Text variant="xs-regular" className="text-gray-700">
                      Link Active From
                    </Text>
                    <input
                      name="start"
                      type="text"
                      className="mt-1  w-full rounded-lg border p-2 text-sm "
                      placeholder="02/10/2023"
                    ></input>
                  </div>
                  
                  <div className="relative">
                    <Text variant="xs-regular" className="text-gray-700">
                      Expires On
                    </Text>
                    <input
                      name="end"
                      type="text"
                      className="mt-1  w-full rounded-lg border p-2 text-sm"
                      placeholder="02/10/2023"
                    ></input>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  value=""
                  className="peer sr-only"
                  checked
                  disabled
                ></input>
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>

                <Text variant="xs-semibold" className="ml-2">
                  Accept payment for this form
                </Text>
              </div>
            </div>

            <div className="mt-5 flex justify-between gap-3">
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
