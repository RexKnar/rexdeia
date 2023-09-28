'use client';

import { MailCheck, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from 'ui';

export function ForgetPasswordForm() {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showNumberInput, setShowNumberInput] = useState(false);
  const [accountText, setAccountText] = useState('Verify Your Account');
  const [optionText, setOptionText] = useState(
    'Select option to verify your account with',
  );
  const router = useRouter();
  const handleEmailVerificationClick = () => {
    setShowEmailInput(true);
    setShowNumberInput(false);
    setAccountText('Forgot Password');
    setOptionText('Select option to reset your password');
  };
  const handleNumberVerificationClick = () => {
    setShowNumberInput(true);
    setShowEmailInput(false);
    setAccountText('Forgot Password');
    setOptionText('Select option to reset your password');
  };
  const handleSendLinkClick = (e) => {
    e.preventDefault();
    router.push('/otpVerify');
  };
  return (
    <form onSubmit={handleSendLinkClick}>
      <div className="mt-10 flex flex-col">
        <span className="mb-4 text-2xl font-semibold">{accountText}</span>
        <p className="text-sm font-normal text-gray-800">
          {optionText} <span className="text-blue-600">Acadx</span>
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <Button
          type="button"
          className="mt-3 w-full bg-transparent p-2 text-base text-gray-800 outline outline-gray-300 hover:text-white"
          onClick={handleEmailVerificationClick}
        >
          <div className="p flex flex-col items-center text-center">
            <MailCheck size={18} className="" />
            <p className="text-sm">Verify via email</p>
          </div>
        </Button>
        <Button
          type="button"
          className="mt-3 w-full  bg-transparent text-base text-gray-800 outline outline-gray-300 hover:text-white"
          onClick={handleNumberVerificationClick}
        >
          <div className="flex flex-col items-center text-center">
            <Smartphone size={18} className="" />
            <p className="text-sm">Verify via phone</p>
          </div>
        </Button>
      </div>
      {showEmailInput && (
        <div className="relative">
          <label className="mt-5 block text-sm font-medium  text-slate-500">
            Email
          </label>
          <Input
            type="email"
            className="mt-2 text-sm"
            placeholder="Enter your email"
          />
        </div>
      )}
      {showNumberInput && (
        <div className="relative">
          <label className="mt-5 block text-sm font-medium text-slate-500 ">
            Number
          </label>
          <Input
            type="number"
            className="mt-2 text-sm"
            placeholder="Enter your number"
          />
        </div>
      )}
      <Button type="submit" className="mt-10 w-full text-white">
        {' '}
        Send link
      </Button>
    </form>
  );
}
