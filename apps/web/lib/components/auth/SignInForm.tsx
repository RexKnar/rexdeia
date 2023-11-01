'use client';
import { AlertCircleIcon, Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription, Button, Input } from 'ui';

import googlelogo from '../../../public/assets/images/Google_logo.png';
import microsoftlogo from '../../../public/assets/images/Microsoft_logo.png';

const errors = {
  INVALID_PASSWORD:
    'The username or password you entered is incorrect. Please try again.',
};

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors, isSubmitting },
  } = useForm();

  const searchParams = useSearchParams();
  console.log(searchParams);
  const error = searchParams.get('error');

  async function signInHandler({ email, password }) {
    try {
      await signIn('credentials', {
        email: email,
        password: password,
        callbackUrl: '/workspace',
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form
      className="mt-4"
      autoComplete="off"
      onSubmit={handleSubmit(signInHandler)}
    >
      {error && (
        <Alert className="mb-2">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription className="text-red-600">
            {errors.INVALID_PASSWORD}
          </AlertDescription>
        </Alert>
      )}
      <label className="mt-5 block text-sm font-medium text-slate-500">
        Email
      </label>
      <div className="relative">
        <Input
          type="email"
          className="mt-2 text-sm"
          placeholder="Enter your email"
          {...register('email', {
            required: 'Your email address is needed to sign in',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Please provide a valid email address',
            },
          })}
        />
        <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
          <Mail size={18} strokeWidth={0.5} />
        </div>
      </div>
      <p
        className={`h-2 p-1 text-sm text-red-600 ${
          fieldErrors.email
            ? 'opacity-100 transition-opacity duration-300'
            : 'opacity-0 transition-opacity duration-300'
        }`}
      >
        {fieldErrors.email?.message || errors[error]}
      </p>
      <label className="mt-4 block text-sm font-medium text-slate-500">
        Password
      </label>
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className="mt-2 text-sm"
          placeholder="Enter your password"
          {...register('password', {
            required: 'Your password is needed to sign in.',
          })}
        />
        <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
          <div onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <Eye size={20} strokeWidth={0.5} />
            ) : (
              <EyeOff size={20} strokeWidth={0.5} />
            )}
          </div>
        </div>
      </div>
      <p
        className={`h-2 p-1 text-sm text-red-600 ${
          fieldErrors.password
            ? 'opacity-100 transition-opacity duration-300'
            : 'opacity-0 transition-opacity duration-300'
        }`}
      >
        {fieldErrors.password?.message as string}
      </p>
      <label className="mt-2 block text-end text-sm font-semibold text-gray-800">
        <Link href="/account-recovery">Forgot Password?</Link>
      </label>
      <Button
        type="submit"
        className="mt-6 w-full text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
          </div>
        ) : (
          `Sign in`
        )}
      </Button>
      <label className="mt-8 block text-center text-sm font-semibold text-gray-800">
        <div className="flex items-center justify-center">
          <div className="h-px flex-grow bg-gray-200"></div>
          <span className="px-2 text-gray-800">or continue with</span>
          <div className="h-px flex-grow bg-gray-200"></div>
        </div>
      </label>
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <Button
          type="button"
          variant="ghost"
          className="mt-3 w-full bg-transparent px-4 py-3 text-base text-gray-800 outline outline-gray-300 hover:outline-primary-800"
        >
          <Image src={googlelogo} alt={'logo'} className="mr-1"></Image>
          Google
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="mt-3 w-full bg-transparent px-4 py-3 text-base text-gray-800 outline outline-gray-300 hover:outline-primary-800"
        >
          <Image src={microsoftlogo} alt={'logo'} className="mr-1"></Image>
          Microsoft
        </Button>
      </div>
    </form>
  );
}
