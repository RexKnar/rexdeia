'use client';

import { MailCheck, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Button, Input } from 'ui';

import { OtpVerifyForm } from './OtpVerifyForm';
// import { ResetPasswordForm } from './ResetPasswordForm';

export function RecoveryPasswordForm() {
  const [isOtp, setIsOtp] = useState(true);
  const [isEmailInput, setIsEmailInput] = useState(true);
  const [isNumberInput, setIsNumberInput] = useState(false);
  const handleEmailVerificationClick = () => {
    setIsEmailInput(true);
    setIsNumberInput(false);
  };
  const handleNumberVerificationClick = () => {
    setIsNumberInput(true);
    setIsEmailInput(false);
  };
  const handleSendLinkClick = (e) => {
    e.preventDefault();
    setIsOtp(false);
  };
  return (
    <div>
      {isOtp && (
        <form onSubmit={handleSendLinkClick} className="mt-14">
          <div className="mt-16 flex flex-col">
            <span className="mt-4 text-2xl font-semibold">
              Recover Your Account
            </span>
            <p className="mt-2 text-sm font-normal text-gray-800">
              Select option to recover your account with
              <span className="text-blue-600">acadx</span>
            </p>
          </div>
          <div className="mt-4 flex flex-col sm:gap-4 lg:flex-row">
            <Button
              type="button"
              className={`mt-3 h-20 w-full rounded-xl bg-transparent p-2 text-base text-gray-800 outline  hover:text-white  ${
                isEmailInput
                  ? 'text-primary outline-primary-500'
                  : 'outline-gray-300'
              }`}
              onClick={handleEmailVerificationClick}
            >
              <div className="flex flex-col items-center  text-center">
                <MailCheck size={18} className="" />
                <p className="mt-2 text-sm">Recover via email</p>
              </div>
            </Button>
            <Button
              type="button"
              className={`mt-3 h-20 w-full rounded-xl bg-transparent text-base text-gray-800 outline hover:text-white  ${
                !isEmailInput
                  ? 'text-primary outline-primary-500'
                  : 'outline-gray-300'
              }`}
              onClick={handleNumberVerificationClick}
            >
              <div className="flex flex-col items-center text-center">
                <Smartphone size={18} className="" />
                <p className="mt-2 text-sm">Recover via phone</p>
              </div>
            </Button>
          </div>
          {isEmailInput && (
            <div className="relative">
              <Input
                type="email"
                className="mt-4 text-sm"
                placeholder="Enter your email"
              />
            </div>
          )}
          {isNumberInput && (
            <div className="relative">
              <Input
                type="text"
                className="mt-4 text-sm"
                placeholder="Enter your number"
              />
            </div>
          )}
          <Button type="submit" className="mt-8 w-full text-white">
            {' '}
            Send link
          </Button>
        </form>
      )}
      {!isOtp && <OtpVerifyForm />}
    </div>
  );
}
