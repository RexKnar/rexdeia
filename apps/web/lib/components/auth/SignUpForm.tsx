'use client';

import { Button, Input } from 'ui';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { makeAPICall } from '../../api';
import { REGISTER_USER } from '../../endpoints';
import { useState } from 'react';

export function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function signupHandler({ name, email, password, phoneNumber }) {
    try {
      setIsSubmitting(true);
      await makeAPICall(REGISTER_USER, {
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
      });
      await signIn('credentials', {
        name: name,
        email: email,
        password: password,
        callbackUrl: '/setup',
        phoneNumber: phoneNumber,
      });
      debugger;
    } catch (error) {
      debugger;
      console.error(error);
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
        <Button type="submit" className="w-full text-white">
          {isSubmitting && (
            <svg
              aria-hidden="true"
              role="status"
              className="mr-3 inline h-4 w-4 animate-spin text-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          )}
          Next
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
