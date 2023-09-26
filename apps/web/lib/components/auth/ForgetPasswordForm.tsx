'use client';

import { useForm } from 'react-hook-form';
import { Alert, AlertDescription, Button, Input } from 'ui';


export function ForgetPasswordForm() {

  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors, isSubmitting },
  } = useForm();

  return (
    <form action="">
      <label className="block text-sm font-semibold">Email</label>
      <Input
        type="email"
        className="mt-2 text-sm"
        placeholder="Enter your email"
      />
      <Button
        type="submit"
        className="mt-10 w-full text-white"
      > Send
      </Button>
    </form>
  )

}