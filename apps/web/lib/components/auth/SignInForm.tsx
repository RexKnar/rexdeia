'use client';

import { Alert, AlertDescription, Button, Input } from 'ui';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { AlertCircleIcon, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import googlelogo from '../../../public/assets/images/Google_logo.png';
import microsoftlogo from '../../../public/assets/images/Microsoft_logo.png';
const errors = {
  INVALID_PASSWORD:
    'The username or password you entered is incorrect. Please try again.',
};

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors, isSubmitting },
  } = useForm();

  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  async function signInHandler({ email, password }) {
    try {
      await signIn('credentials', {
        email: email,
        password: password,
        callbackUrl: '/',
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form className="mt-4" onSubmit={handleSubmit(signInHandler)}>
      {error && (
        <Alert className="mb-2">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>{errors[error]}</AlertDescription>
        </Alert>
      )}
      <label className="sub-text inter block text-sm font-semibold">
        Email
      </label>
      <Input
        type="email"
        className="sub-text inter mt-2 text-sm"
        placeholder="Enter your email"
        {...register('email', {
          required: 'Your email address is needed to sign in',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: 'Please provide a valid email address',
          },
        })}
      />
      <p
        className={`h-2 p-1 text-sm text-red-600 ${
          fieldErrors.email
            ? 'opacity-100 transition-opacity duration-300'
            : 'opacity-0 transition-opacity duration-300'
        }`}
      >
        {fieldErrors.email?.message as string}
      </p>
      <label className="sub-text inter mt-4 block text-sm font-semibold">
        Password
      </label>
      <Input
        type="password"
        className="sub-text inter mt-1 text-sm"
        placeholder="Enter your password"
        {...register('password', {
          required: 'Your password is needed to sign in.',
        })}
      />
      <p
        className={`h-2 p-1 text-sm text-red-600 ${
          fieldErrors.password
            ? 'opacity-100 transition-opacity duration-300'
            : 'opacity-0 transition-opacity duration-300'
        }`}
      >
        {fieldErrors.password?.message as string}
      </p>
      <label className="inter mt-2 block text-end text-sm font-semibold text-gray-800">
        Forgot Password?
      </label>
      <Button
        type="submit"
        className="mt-10 w-full w-full text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
          </div>
        ) : (
          `Sign in`
        )}
      </Button>
      <label className="inter inter mt-8 block text-center text-base font-semibold text-gray-800">
        or continue with{' '}
      </label>
      <div className="flex justify-center gap-4">
        <Button
          type="submit"
          className="text-base mt-3 w-full bg-transparent bg-transparent text-gray-800 outline outline-gray-300 hover:text-white"
        >
          <Image src={googlelogo} alt={'logo'} className="mr-1"></Image>
          Google
        </Button>
        <Button
          type="submit"
          className="text-base mt-3 w-full bg-transparent bg-transparent text-gray-800 outline outline-gray-300 hover:text-white"
        >
          <Image src={microsoftlogo} alt={'logo'} className="mr-1"></Image>
          Microsoft
        </Button>
      </div>
    </form>
  );
}