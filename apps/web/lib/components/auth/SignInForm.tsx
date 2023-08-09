'use client';

import { Alert, AlertDescription, Button, Input } from 'ui';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { AlertCircleIcon, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const errors = {
  INVALID_PASSWORD:
    'The username or password you entered is incorrect. Please try again.',
};

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
      setError('password', {
        type: 'manual',
        message: 'invalid email or password',
      });
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
      <label className="block text-gray-700">Email Address</label>
      <Input
        type="email"
        className="mt-2"
        placeholder="Enter your email address"
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
      <label className="mt-4 block text-gray-700">Password</label>
      <Input
        type="password"
        className="mt-1"
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
      <Button
        type="submit"
        className="mt-6 w-full w-full text-white"
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
    </form>
  );
}
