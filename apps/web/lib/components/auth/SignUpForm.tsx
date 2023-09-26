'use client';

import { Loader2, Mail, PhoneCall, User2 } from 'lucide-react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Button, Input } from 'ui';

import googlelogo from '../../../public/assets/images/Google_logo.png';
import microsoftlogo from '../../../public/assets/images/Microsoft_logo.png';
import { makeAPICall } from '../../api';
import { REGISTER_USER } from '../../endpoints';

const errorValue = {
  user_exists: 'Email id is already in use',
  too_small: 'Password must contain at least 6 characters.',
};

type OnboardUserResponse = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  createdBranchId: string;
  createdOrganizationId: string;
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
      const { createdBranchId, createdOrganizationId } =
        await makeAPICall<OnboardUserResponse>(REGISTER_USER, {
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
        phoneNumber: phoneNumber,
        callbackUrl: `/setup?branch=${createdBranchId}&organization=${createdOrganizationId}`,
      });
    } catch (error) {
      if (
        Array.isArray(error) &&
        error.length > 0 &&
        error[0].path &&
        error[0].path[0] === 'password'
      ) {
        setError('password', {
          type: 'custom',
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
          type: 'custom',
          message: errorValue[(error[0] as any).code],
        });
      }
    }
  }

  return (
    <form className="mt-5" onSubmit={handleSubmit(signupHandler)}>
      <div>
        <label className="sub-text inter block text-sm font-semibold">
          Full Name
        </label>
        <div className="relative">
          <Input
            type="text"
            className="mt-2"
            placeholder="Enter your full name"
            {...register('name', {
              required: 'Your name is needed to sign up',
            })}
          />
          <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
            <User2 size={20} strokeWidth={0.5} />
          </div>
        </div>
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
        <label className="sub-text inter block text-sm font-semibold">
          Email Address
        </label>
        <div className="relative">
          <Input
            name="email"
            type="email"
            className="mt-2"
            placeholder="Enter your email address"
            {...register('email', {
              required: 'Your email address is needed to sign up',
            })}
          />
          <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
            <Mail size={18} strokeWidth={0.5} />
          </div>
        </div>
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
        <label className="sub-text inter block text-sm font-semibold">
          Phone Number
        </label>
        <div className="relative">
          <Input
            type="number"
            className="mt-2"
            name="phoneNumber"
            placeholder="Enter your phone number"
            {...register('phoneNumber', {
              required: 'Your phone number is needed to sign up',
            })}
          />
          <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
            <PhoneCall size={18} strokeWidth={0.5} />
          </div>
        </div>
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
        <label className="sub-text inter block text-sm font-semibold">
          Password
        </label>
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
      <label className="inter inter mt-8 block text-center text-sm font-semibold text-gray-800">
        or continue with{' '}
      </label>
      <div className="flex justify-center gap-4">
        <Button
          type="button"
          className="mt-3 w-full  bg-transparent text-base text-gray-800 outline outline-gray-300 hover:text-white"
        >
          <Image src={googlelogo} alt={'logo'} className="mr-1"></Image>
          Google
        </Button>
        <Button
          type="button"
          className="mt-3 w-full  bg-transparent text-base text-gray-800 outline outline-gray-300 hover:text-white"
        >
          <Image src={microsoftlogo} alt={'logo'} className="mr-1"></Image>
          Microsoft
        </Button>
      </div>
    </form>
  );
}
