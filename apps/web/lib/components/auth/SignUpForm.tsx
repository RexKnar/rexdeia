'use client';

import { Button, Input } from "ui";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { makeAPICall } from "../../api";
import { REGISTER_USER } from "../../endpoints";

export function SignUpForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  async function signupHandler({ name, email, password, phoneNumber }) {
    try {
      await makeAPICall(REGISTER_USER, {
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber
      });

      await signIn('credentials', {
        name: name,
        email: email,
        password: password,
        callbackUrl: '/setup',
        phoneNumber: phoneNumber
      });
    }
    catch (error) {
      console.log(error);
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
          {...register('name', { required: true })}
        />
        {errors.name && <p>Name is required</p>}
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Email Address</label>
        <Input
          name="email"
          type="email"
          className="mt-2"
          placeholder="Enter your email address"
          {...register('email', { required: true })}
        />
        {errors.email && <p>Email is required</p>}
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Phone Number</label>
        <Input
          type="number"
          className="mt-2"
          name="phoneNumber"
          placeholder="Enter your phone number"
          {...register('phoneNumber', { required: true })}
        />
        {errors.phoneNumber && <p>Phone number is required</p>}
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Password</label>
        <Input
          name="password"
          type="password"
          className="mt-2"
          placeholder="Enter your password"
          {...register('password', { required: true })}
        />
        {errors.password && <p>Password is required</p>}
      </div>
      <div className="mt-6 w-full">
        <Button type="submit" className="w-full text-white">
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
  )
}