'use client';
import { useRouter } from 'next/navigation';
import { RefObject, useRef } from 'react';
import { Button, Input } from 'ui';

export function OtpVerifyForm() {
  const router = useRouter();
  const inputRefs: RefObject<HTMLInputElement>[] = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const handleSendLinkClick = (e) => {
    e.preventDefault();
    router.push('/resetPassword');
  };
  const handleInput = (e, index) => {
    if (index < inputRefs.length - 1 && e.target.value) {
      inputRefs[index + 1]?.current?.focus();
    }
  };
  return (
    <form onSubmit={handleSendLinkClick} className="mt-16">
      <div className="mt-14 flex flex-col">
        <span className=" mt-2 text-2xl font-semibold">Enter OTP</span>
        <p className="mt-2 text-sm font-normal text-gray-800">
          We have sent you OTP to your email address for verification{' '}
        </p>
      </div>
      <div className="mt-5 flex space-x-4">
        {inputRefs.map((inputRef, index) => {
          return (
            <Input
              key={index}
              type="text"
              className="mt-4 h-12 rounded-lg text-sm"
              placeholder="0"
              ref={inputRef}
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
  );
}
