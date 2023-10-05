'use client';

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button, Input } from 'ui';

import logo from '../../../public/assets/images/acadx-logo.png';

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <section className="flex h-full flex-col justify-center sm:flex-row">
      <section
        className="hidden flex-grow bg-cover bg-left bg-no-repeat sm:flex sm:w-1/4"
        style={{
          backgroundImage: 'url(/assets/images/forgot-password-banner-1.png)',
          opacity: 0.2,
        }}
      ></section>
      <section className="mt-2 flex h-full translate-y-0 transform flex-col justify-between overflow-auto px-20 transition-all duration-500 ease-in-out sm:w-full md:w-4/5 lg:w-3/5 xl:w-2/5">
        <div className="flex justify-center">
          <Image src={logo} className="pt-10 " alt={'logo'} width={100}></Image>
        </div>
        <form className="mt-16">
          <div className="mt-16 flex flex-col">
            <span className="mt-4 text-2xl font-semibold">
              Reset Your Password
            </span>
            <p className="mt-2 text-sm font-normal text-gray-800">
              Please enter your new password{' '}
            </p>
          </div>
          <label className="mt-6 block text-sm font-medium text-slate-500">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              className="mt-2 text-sm"
              placeholder="Enter your password"
            />
            <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2 ">
              <div onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye size={20} strokeWidth={0.5} />
                ) : (
                  <EyeOff size={20} strokeWidth={0.5} />
                )}
              </div>
            </div>
          </div>
          <label className="mt-4 block text-sm font-medium text-slate-500">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              className="mt-2 text-sm"
              placeholder="Enter your password"
            />
            <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2 ">
              <div onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <Eye size={20} strokeWidth={0.5} />
                ) : (
                  <EyeOff size={20} strokeWidth={0.5} />
                )}
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-10 w-full text-white">
            {' '}
            Update
          </Button>
        </form>
        <footer className="mt-16 text-center text-sm font-normal text-gray-700">
          <div className="mt-14">&copy; acadx 2023</div>
        </footer>
      </section>
      <section
        className="hidden flex-grow bg-cover bg-left bg-no-repeat sm:flex sm:w-1/4"
        style={{
          backgroundImage: 'url(/assets/images/forgot-password-banner-2.png)',
          opacity: 0.4,
        }}
      ></section>
    </section>
  );
}
