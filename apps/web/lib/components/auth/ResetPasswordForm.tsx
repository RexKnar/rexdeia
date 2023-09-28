'use client';

import { Button, Input } from 'ui';

export function ResetPasswordForm() {
  return (
    <form action="">
      <div className="mt-10 flex flex-col">
        <span className="mb-4 text-2xl font-semibold">Reset Your Password</span>
        <p className="text-sm font-normal text-gray-800">
          Please enter your new password{' '}
        </p>
      </div>
      <label className="mt-4 block text-sm font-medium text-slate-500">
        Password
      </label>
      <div className="relative">
        <Input
          type="password"
          className="mt-2 text-sm"
          placeholder="Enter your password"
        />
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
      </div>
      <Button type="submit" className="mt-10 w-full text-white">
        {' '}
        Update
      </Button>
    </form>
  );
}
