'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { CalendarIcon, Files, Share2 } from 'lucide-react';
import {
  Button,
  Calendar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
} from 'ui';

import shareIcon from '../../../../../public/assets/images/shareIcon.svg';
import { useSaveShareDetailsForFormMutationQuery } from '../../../../../lib/queries/useSaveShareDetailsForFormMutationQuery';
import { useGetAdmissionFormShareDetailsQuery } from '../../../../../lib/queries/useGetAdmissionFormShareDetailsQuery';

type AdmissionShareFlyoutProps = {
  formId: string;
};

export function AdmissionShareFlyout({ formId }: AdmissionShareFlyoutProps) {
  const { data: shareDetails } = useGetAdmissionFormShareDetailsQuery(formId);
  const { mutateAsync, isPending } = useSaveShareDetailsForFormMutationQuery();

  const [activeFromDate, setActiveFromDate] = useState<Date>();
  const [activeToDate, setActiveToDate] = useState<Date>();
  const [acceptPayment, setAcceptPayment] = useState(false);
  const [actualAmount, setActualAmount] = useState<number>();
  const [discountAmount, setDiscountAmount] = useState<number>();
  const [isLinkActive, setIsLinkActive] = useState(false);

  async function handleOnSaveButtonClick() {
    await mutateAsync({
      formId,
      activeToDate,
      actualAmount,
      acceptPayment,
      discountAmount,
      activeFromDate,
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </SheetTrigger>
      <SheetContent side="right" widthSize="sm" className="bg-white p-10">
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
                  className="ml-2 text-sm font-semibold"
                >
                  Share
                </label>
              </div>
              <div className="flex items-center">
                <Switch
                  id="toggleSwitch"
                  checked={isLinkActive}
                  onCheckedChange={() => {
                    setIsLinkActive(!isLinkActive);
                  }}
                />
                <label
                  htmlFor="toggleSwitch"
                  className="ml-2 text-sm font-semibold"
                >
                  {isLinkActive ? 'Active' : 'Inactive'}
                </label>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <hr className="my-5 border-t border-gray-300"></hr>
        {shareDetails && shareDetails.length && (
          <section className="relative">
            <label htmlFor="url" className="text-sm font-normal text-gray-700">
              URL
            </label>
            <Input
              id="url"
              disabled
              type="text"
              className="mt-1 w-full border border-primary p-3 text-xs font-normal"
              placeholder={shareDetails[0].id}
            />
            <Files
              size={18}
              className="absolute right-3 -translate-y-7 transform cursor-pointer text-primary"
            />
          </section>
        )}
        <section className="mt-4 grid gap-7">
          <div className="mt-2 grid justify-between gap-3 sm:grid-cols-1 md:grid-cols-2">
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
                <PopoverContent className="w-auto bg-white p-0" align="start">
                  <Calendar
                    mode="single"
                    initialFocus
                    selected={activeFromDate}
                    onSelect={setActiveFromDate}
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
                <PopoverContent className="w-auto bg-white p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={activeToDate}
                    onSelect={setActiveToDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex items-center">
            <Switch
              id="paymentAcceptToggle"
              checked={acceptPayment}
              onCheckedChange={() => {
                setAcceptPayment(!acceptPayment);
              }}
            />
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
                type="numeric"
                placeholder="₹"
                value={actualAmount}
                onChange={(e) => {
                  setActualAmount(parseInt(e.target.value));
                }}
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
                type="numeric"
                placeholder="₹"
                value={discountAmount}
                onChange={(e) => {
                  setDiscountAmount(parseInt(e.target.value));
                }}
                className="mt-1 border border-primary-200 p-1"
              />
            </div>
          </div>
          <Button
            size="lg"
            variant="default"
            disabled={isPending}
            aria-disabled={isPending}
            onClick={handleOnSaveButtonClick}
            aria-label={isPending ? 'Saving...' : 'Save'}
            className="mx-auto flex justify-center px-16 py-4"
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </section>
      </SheetContent>
    </Sheet>
  );
}
