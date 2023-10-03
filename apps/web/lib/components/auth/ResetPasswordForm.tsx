'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button, Input } from 'ui';

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form className="mt-16">
      <div className="mt-16 flex flex-col">
        <span className="mt-4 text-2xl font-semibold">Reset Your Password</span>
        <p className="mt-2 text-sm font-normal text-gray-800">
          Please enter your new password{' '}
        </p>
      </div>
      <label className="mt-6 block text-sm font-medium text-slate-500">
        Password
      </label>
      <div className="relative">
        <Input
          type="password"
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
          type="password"
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
      <Button type="submit" className="mt-10 w-full text-white">
        {' '}
        Update
      </Button>
    </form>
  );
}
