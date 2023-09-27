'use client';
import { MailCheck, Smartphone } from 'lucide-react';
import { Button } from 'ui';

export function ForgetPasswordForm() {
  return (
    <form action="">
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <Button
          type="button"
          className="mt-3 w-full bg-transparent p-2 text-base text-gray-800 outline outline-gray-300 hover:text-white"
        >
          <div className="p flex flex-col items-center text-center">
            <MailCheck size={18} className="" />
            <p className="text-sm">Verify via email</p>
          </div>
        </Button>
        <Button
          type="button"
          className="mt-3 w-full  bg-transparent text-base text-gray-800 outline outline-gray-300 hover:text-white "
        >
          <div className="flex flex-col items-center text-center">
            <Smartphone size={18} className="" />
            <p className="text-sm">Verify via phone</p>
          </div>
        </Button>
      </div>
      <Button type="submit" className="mt-10 w-full text-white">
        {' '}
        Send link
      </Button>
    </form>
  );
}
