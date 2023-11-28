'use client';

import { AlertCircleIcon, CalendarIcon, Files, Share2 } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertDescription,
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
  Text,
  useToast,
} from 'ui';
import { copyToClipboard } from 'utils';

import { useCreateShareDetailsForFormMutationQuery } from '../../../../../lib/queries/useCreateShareDetailsForFormMutationQuery';
import { useGetAdmissionFormShareDetailsQuery } from '../../../../../lib/queries/useGetAdmissionFormShareDetailsQuery';
import { useUpdateShareDetailsForFormMutationQuery } from '../../../../../lib/queries/useUpdateShareDetailsForFormMutationQuery';
import shareIcon from '../../../../../public/assets/images/shareIcon.svg';

type AdmissionShareFlyoutProps = {
  formId: string;
};

export function AdmissionShareFlyout({ formId }: AdmissionShareFlyoutProps) {
  const { toast } = useToast();

  const [shareDetailsId, setShareDetailsId] = useState<string>();

  const [activeToDate, setActiveToDate] = useState(new Date());
  const [activeFromDate, setActiveFromDate] = useState(new Date());

  const [isLinkActive, setIsLinkActive] = useState(false);
  const [acceptPayment, setAcceptPayment] = useState(false);

  const [actualAmount, setActualAmount] = useState<number>();
  const [discountAmount, setDiscountAmount] = useState<number>();

  const { data: shareDetailsList } =
    useGetAdmissionFormShareDetailsQuery(formId);

  const {
    mutateAsync: mutateUpdateShareDetailsAsync,
    isPending: isPendingUpdateShareDetails,
    isError: isErrorUpdateShareDetails,
  } = useUpdateShareDetailsForFormMutationQuery(shareDetailsId);

  const {
    mutateAsync: mutateCreateShareDetailsAsync,
    isPending: isPendingCreateShareDetails,
    isError: isErrorCreateShareDetails,
  } = useCreateShareDetailsForFormMutationQuery();

  useEffect(() => {
    if (isErrorCreateShareDetails || isErrorUpdateShareDetails) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Something went wrong. Please try again later.',
      });
    }
  }, [isErrorCreateShareDetails, isErrorUpdateShareDetails]);

  useEffect(() => {
    if (shareDetailsList && shareDetailsList.length) {
      const shareDetails = shareDetailsList[0];

      setShareDetailsId(shareDetails.id);
      setIsLinkActive(shareDetails.isActive);
      setActualAmount(shareDetails.actualAmount);
      setAcceptPayment(shareDetails.acceptPayment);
      setDiscountAmount(shareDetails.discountAmount);
      setActiveToDate(new Date(shareDetails.activeToDate));
      setActiveFromDate(new Date(shareDetails.activeFromDate));
    }
  }, [shareDetailsList]);

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
            <hr className="my-5 border-t border-gray-300"></hr>
          </SheetTitle>
          <SheetDescription>
            <Alert className="mb-2">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                <Text variant="sm-regular">
                  Share your admission form with the public to streamline the
                  application process.
                </Text>
                <br />
                <Text variant="sm-regular">
                  Just make sure you have toggled the <strong>Active</strong>{' '}
                  switch on the top, if you want to make the form active for
                  public. Further, you can customize the availability of the
                  form by setting <strong>active from</strong> and{' '}
                  <strong>expires on</strong> dates.
                </Text>
              </AlertDescription>
            </Alert>
          </SheetDescription>
        </SheetHeader>
        {shareDetailsList && shareDetailsList.length && (
          <section className="relative">
            <label htmlFor="url" className="text-sm font-normal text-gray-700">
              URL
            </label>
            <Input
              id="url"
              type="text"
              className="mt-1 w-full p-3 text-xs font-normal"
              value={`https://www.acadx.io/forms/${shareDetailsList[0].id}`}
            />
            <Files
              size={28}
              onClick={async () => {
                await copyToClipboard(
                  `https://www.acadx.io/forms/${shareDetailsList[0].id}`
                );

                toast({
                  title: 'Success',
                  description: 'Link copied to clipboard successfully.',
                });
              }}
              className="absolute right-1 top-[34px] transform cursor-pointer rounded-lg p-1.5 text-primary hover:bg-gray-100"
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
                    {activeFromDate.toDateString()}
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
                    {activeToDate.toDateString()}
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
            disabled={
              isPendingCreateShareDetails || isPendingUpdateShareDetails
            }
            aria-disabled={
              isPendingCreateShareDetails || isPendingUpdateShareDetails
            }
            onClick={async () => {
              if (shareDetailsId) {
                await mutateUpdateShareDetailsAsync({
                  formId,
                  activeToDate,
                  actualAmount,
                  acceptPayment,
                  discountAmount,
                  activeFromDate,
                });
              } else {
                await mutateCreateShareDetailsAsync({
                  formId,
                  activeToDate,
                  actualAmount,
                  acceptPayment,
                  discountAmount,
                  activeFromDate,
                });
              }
            }}
            aria-label={
              isPendingCreateShareDetails || isPendingUpdateShareDetails
                ? 'Saving...'
                : 'Save'
            }
            className="mx-auto flex justify-center px-16 py-4"
          >
            {isPendingCreateShareDetails || isPendingUpdateShareDetails
              ? 'Saving...'
              : 'Save'}
          </Button>
        </section>
      </SheetContent>
    </Sheet>
  );
}
