'use client';

import Link from 'next/link';
import { RefObject, useRef } from 'react';
import { Button, Input } from 'ui';

export function OtpVerifyForm() {
  const inputRefs: RefObject<HTMLInputElement>[] = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const handleInput = (e, index) => {
    if (index < inputRefs.length - 1 && e.target.value) {
      inputRefs[index + 1]?.current?.focus();
    } else if (index === inputRefs.length - 1 && e.target.value) {
      inputRefs[index].current.blur();
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="mt-16">
        <div className="mt-14 flex flex-col">
          <span className=" mt-4 text-2xl font-semibold">Enter OTP</span>
          <p className="mt-2 text-sm font-normal text-gray-800">
            We have sent you OTP to your email address for verification{' '}
          </p>
        </div>
        <div className="remove-arrow mt-5 flex space-x-4 ">
          {inputRefs.map((inputRef, index) => {
            return (
              <Input
                key={index}
                inputMode="numeric"
                className="mt-4 h-12 rounded-lg text-sm"
                placeholder="0"
                ref={inputRef}
                maxLength={1}
                onInput={(e) => handleInput(e, index)}
              />
            );
          })}
        </div>
        <Button type="submit" className="mt-10 w-full text-white">
          {' '}
          Next
        </Button>
      </form>
      <p className=" mt-16 text-center text-sm font-semibold text-gray-800">
        Don&apos;t receive the OTP?
      </p>
      <Link
        href="/signin"
        className="mt-8 w-full rounded-md border-2 border-gray-300 bg-transparent p-2 text-center text-sm font-semibold text-primary hover:bg-primary hover:text-white"
      >
        Resend code
      </Link>
      <div className="mt-16">
        <footer className="mt-16 text-center text-sm font-normal text-gray-700">
          &copy; acadx 2023
        </footer>
      </div>
    </>
  );
}
