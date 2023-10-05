'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RefObject, useRef } from 'react';
import { Button, Input } from 'ui';

import logo from '../../../public/assets/images/acadx-logo.png';

export function OtpVerifyForm() {
  const inputRefs: RefObject<HTMLInputElement>[] = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const handleSendLinkClick = (e) => {
    e.preventDefault();
    console.log('clicked');
  };
  const handleInput = (e, index) => {
    if (index < inputRefs.length - 1 && e.target.value) {
      inputRefs[index + 1]?.current?.focus();
    }
  };
  return (
    <section className="flex h-full flex-col justify-center sm:flex-row">
      <section
        className="flex-grow bg-cover bg-left bg-no-repeat sm:flex sm:w-1/4"
        style={{
          backgroundImage: 'url(/assets/images/forgot-password-banner-1.png)',
          opacity: 0.2,
        }}
      ></section>
      <section className="flex h-full translate-y-0 transform flex-col justify-between overflow-auto px-20 transition-all duration-500 ease-in-out sm:w-full md:w-4/5 lg:w-3/5 xl:w-2/5">
        <div className="flex justify-center">
          <Image src={logo} className="pt-10 " alt={'logo'} width={100}></Image>
        </div>
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
        <p className=" mt-16 text-center text-sm font-semibold text-gray-800">
          Don&apos;t receive the OTP?
        </p>
        <Link
          href="/signin"
          className="mt-6 w-full rounded-md border-2 border-gray-300 bg-transparent p-2 text-center text-sm font-semibold text-primary hover:bg-primary hover:text-white"
        >
          Resend code
        </Link>
        <footer className="mt-16 text-center text-sm font-normal text-gray-700">
          <div>&copy; acadx 2023</div>
        </footer>
      </section>
      <section
        className="flex-grow bg-cover bg-left bg-no-repeat sm:flex sm:w-1/4"
        style={{
          backgroundImage: 'url(/assets/images/forgot-password-banner-2.png)',
          opacity: 0.4,
        }}
      ></section>
    </section>
  );
}
