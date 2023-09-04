'use client';

import { Button, Input } from 'ui';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { makeAPICall } from '../../api';
import { REGISTER_USER } from '../../endpoints';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import googlelogo from '../../../public/assets/images/Google_logo.png';
import microsoftlogo from '../../../public/assets/images/Microsoft_logo.png';
export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function signupHandler({ name, email, password, phoneNumber }) {
    try {
      await makeAPICall(REGISTER_USER, {
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await signIn('credentials', {
        name: name,
        email: email,
        redirect: true,
        password: password,
        callbackUrl: '/setup',
        phoneNumber: phoneNumber,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form className="mt-4" onSubmit={handleSubmit(signupHandler)}>
      <div>
        <label className="sub-text inter block text-sm font-semibold">Full Name</label>
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
        <label className="sub-text inter block text-sm font-semibold">Email Address</label>
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
        <label className="sub-text inter block text-sm font-semibold">Phone Number</label>
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
        <label className="sub-text inter block text-sm font-semibold">Password</label>
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
            `Signup`
          )}
        </Button>
      </div>
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
