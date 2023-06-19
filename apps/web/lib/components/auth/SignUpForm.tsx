'use client';

import { Button, Input } from "ui";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function SignUpForm() {
  async function signupHandler(event) {
    event.preventDefault();

    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    await signIn('credentials', {
      callbackUrl: '/',
      name: name,
      password: password,
      email: email,
    });
  }

  return (
    <form className="mt-4" onSubmit={signupHandler}>
      <div>
        <label className="block text-gray-700">Full Name</label>
        <Input
          name="name"
          type="text"
          className="mt-2"
          placeholder="Enter your full name"
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Email Address</label>
        <Input
          name="email"
          type="email"
          className="mt-2"
          placeholder="Enter your email address"
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Phone Number</label>
        <Input
          type="number"
          className="mt-2"
          placeholder="Enter your phone number"
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Password</label>
        <Input
          name="password"
          type="password"
          className="mt-2"
          placeholder="Enter your password"
        />
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