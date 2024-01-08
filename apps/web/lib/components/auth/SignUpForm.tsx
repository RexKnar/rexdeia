'use client';

import { Eye, EyeOff, Loader2, Mail, PhoneCall, User2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from 'ui';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isLoading, isSubmitting },
    setError,
  } = useForm({
    mode: 'onBlur',
  });

  async function signUpHandler({ name, email, password, phoneNumber }) {
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
    <form className="mt-5" onSubmit={handleSubmit(signUpHandler)}>
      <div>
        <label className="block text-sm font-semibold text-gray-700">
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
        <label className="block text-sm font-semibold text-gray-700">
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
        <label className="block text-sm font-semibold text-gray-700">
          Phone Number
        </label>
        <div className="relative flex items-center gap-2">
          <select
            className="mt-2 rounded-md border border-gray-300 py-2 pl-2 pr-6 outline-blue-300"
            name="countryCode"
            {...register('countryCode')}
          >
            <option value="+91">+91</option>
            <option value="+44">+44</option>
          </select>
          <Input
            type="number"
            id="phoneNumber"
            className="mt-2"
            placeholder="Enter your phone number"
            {...register('phoneNumber', {
              required: 'Your phone number is needed to sign up',
              validate: (value) =>
                value.length === 10 || 'Phone number must be 10 digits long',
            })}
          />
          <div className="absolute inset-y-0 right-0 mt-2 flex cursor-pointer items-center pr-2">
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
        <label className="block text-sm font-semibold text-gray-700">
          Password
        </label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            className="mt-2 text-sm"
            placeholder="Enter your password"
            {...register('password', {
              required: 'Password is needed to sign up',
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
            errors.password
              ? 'opacity-100 transition-opacity duration-300'
              : 'opacity-0 transition-opacity duration-300'
          }`}
        >
          {errors.password?.message as string}
        </p>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-semibold text-gray-700">
          Confirm Password
        </label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            className="mt-2 text-sm"
            placeholder="Enter your password"
            {...register('confirmPassword', {
              required: 'Password confirmation is required',
              validate: (value) =>
                value === watch('password') ||
                'Please make sure your passwords match',
            })}
          />
          <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
            <div onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (
                <Eye size={20} strokeWidth={0.5} />
              ) : (
                <EyeOff size={20} strokeWidth={0.5} />
              )}
            </div>
          </div>
        </div>
        <p
          className={`h-2 p-1 text-sm text-red-600 ${
            errors.confirmPassword
              ? 'opacity-100 transition-opacity duration-300'
              : 'opacity-0 transition-opacity duration-300'
          }`}
        >
          {errors.confirmPassword?.message as string}
        </p>
      </div>
      <div className="mt-6 w-full">
        <Button
          type="submit"
          className={`mt-6 w-full px-4 py-3 text-white ${
            isLoading || isSubmitting ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading || isSubmitting ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
            </div>
          ) : (
            `Signup`
          )}
        </Button>
      </div>
    </form>
  );
}
