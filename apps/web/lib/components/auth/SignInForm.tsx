'use client';

import { Button, Input } from 'ui';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';


export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

  async function signInHandler({ email, password }) {
    try {    
      await signIn('credentials', {
        email: email,
        password: password,
        callbackUrl: '/'
      });     
    } catch (error) {
      setError("password", {
        type: "manual",
        message: "invalid email or password",
      })
    }
  }

  return (
    <form className="mt-4" onSubmit={handleSubmit(signInHandler)}>
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
          errors.email
            ? 'opacity-100 transition-opacity duration-300'
            : 'opacity-0 transition-opacity duration-300'
        }`}
      >
        {errors.email?.message as string}
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
          errors.password
            ? 'opacity-100 transition-opacity duration-300'
            : 'opacity-0 transition-opacity duration-300'
        }`}
      >
        {errors.password?.message as string}
      </p>
      <Button type="submit" className="mt-6 w-full w-full text-white">
        Sign in
      </Button>
    </form>
  );
}
