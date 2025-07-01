'use client';
import { AlertCircleIcon, Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription, Button, Input } from 'ui';

const errors = {
  INVALID_PASSWORD:
    'The username or password you entered is incorrect. Please try again.',
};

export function NewSignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors, isLoading, isSubmitting },
  } = useForm();

  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  async function signInHandler({ email, password }) {
    try {
      await signIn('credentials', {
        email: email,
        password: password,
        callbackUrl: '/workspace',
      });
    } catch (error) {
      console.error(error);
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
      <label className="mt-5 block text-sm font-semibold text-gray-700">
        Email
      </label>
      <div className="relative">

        <Input
          type="email"
          className="mt-1 text-sm"
          placeholder="Enter"
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
        className={`h-2 p-1 text-sm text-red-600 ${fieldErrors.email
          ? 'opacity-100 transition-opacity duration-300'
          : 'opacity-0 transition-opacity duration-300'
          }`}
      >
        {fieldErrors.email?.message || errors[error]}
      </p>
      <label className="mt-2 block text-sm font-semibold text-gray-700">
        Password
      </label>
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className="mt-1 text-sm"
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
        className={`h-2 p-1 text-sm text-red-600 ${fieldErrors.password
          ? 'opacity-100 transition-opacity duration-300'
          : 'opacity-0 transition-opacity duration-300'
          }`}
      >
        {fieldErrors.password?.message as string}
      </p>
      <label className="mt-2 block text-end text-sm font-semibold  text-primary">
        <Link href="/account-recovery">Forgot Password?</Link>
      </label>
      <Button
        type="submit"
        className="mt-6 w-full  text-white"
        disabled={isSubmitting}
      >
        {isLoading || isSubmitting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
          </div>
        ) : (
          `Sign in`
        )}
      </Button>
    </form>
  );
}