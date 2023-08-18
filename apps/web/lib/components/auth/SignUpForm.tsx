'use client';

import { Button, Input } from 'ui';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { makeAPICall } from '../../api';
import { REGISTER_USER } from '../../endpoints';
import { Loader2 } from 'lucide-react';

const errorValue = {
  too_small: 'Password must contain at least 6 characters.',
  user_exists: 'Email id is already in use',
};

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  async function signupHandler({ name, email, password, phoneNumber }) {
    try {
      await makeAPICall(REGISTER_USER, {
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
      });

      await signIn('credentials', {
        name: name,
        email: email,
        redirect: true,
        password: password,
        callbackUrl: '/setup',
        phoneNumber: phoneNumber,
      });
    } catch (error) {
      if (
        Array.isArray(error) &&
        error.length > 0 &&
        error[0].path &&
        error[0].path[0] === 'password'
      ) {
        setError('password', {
          type: 'manual',
          message: errorValue[(error[0] as any).code],
        });
      }

      if (
        Array.isArray(error) &&
        error.length > 0 &&
        error[0].path &&
        error[0].path[0] === 'email'
      ) {
        setError('email', {
          type: 'manual',
          message: errorValue[(error[0] as any).code],
        });
      }
    }
  }

  return (
    <form className="mt-4" onSubmit={handleSubmit(signupHandler)}>
      <div>
        <label className="block text-gray-700">Full Name</label>
        <Input
          type="text"
          className="mt-2"
          placeholder="Enter your full name"
          {...register('name', { required: 'Your name is needed to sign up' })}
        />
        <p
          className={`h-2 p-1 text-sm text-red-600 ${
            errors.name
              ? 'opacity-100 transition-opacity duration-300'
              : 'opacity-0 transition-opacity duration-300'
          }`}
        >
          {errors.name?.message as string}
        </p>
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Email Address</label>
        <Input
          name="email"
          type="email"
          className="mt-2"
          placeholder="Enter your email address"
          {...register('email', {
            required: 'Your email address is needed to sign up',
          })}
        />
        <p
          className={`h-2 p-1 text-sm text-red-600 ${
            errors.email
              ? 'opacity-100 transition-opacity duration-300'
              : 'opacity-0 transition-opacity duration-300'
          }`}
        >
          {errors.email?.message as string}
        </p>
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Phone Number</label>
        <Input
          type="number"
          className="mt-2"
          name="phoneNumber"
          placeholder="Enter your phone number"
          {...register('phoneNumber', {
            required: 'Your phone number is needed to sign up',
          })}
        />
        <p
          className={`h-2 p-1 text-sm text-red-600 ${
            errors.phoneNumber
              ? 'opacity-100 transition-opacity duration-300'
              : 'opacity-0 transition-opacity duration-300'
          }`}
        >
          {errors.phoneNumber?.message as string}
        </p>
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Password</label>
        <Input
          name="password"
          type="password"
          className="mt-2"
          placeholder="Enter your password"
          {...register('password', {
            required: 'Password is needed to sign up',
          })}
        />
        <p
          className={`h-2 p-1 text-sm text-red-600 ${
            errors.password
              ? 'opacity-100 transition-opacity duration-300'
              : 'opacity-0 transition-opacity duration-300'
          }`}
        >
          {errors.password?.message as string}
        </p>
      </div>
      <div className="mt-6 w-full">
        <Button
          type="submit"
          className="w-full text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex h-screen items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
            </div>
          ) : (
            `Next`
          )}
        </Button>
      </div>
      <p className="mt-4 text-center text-gray-500">
        Already have an account?{' '}
        <Link href="/signin" className="text-primary font-semibold">
          Sign in
        </Link>
      </p>
    </form>
  );
}
