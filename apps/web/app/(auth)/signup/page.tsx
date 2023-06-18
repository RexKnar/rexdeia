import Link from 'next/link';
import { Button, Input } from 'ui';
import { signIn } from 'next-auth/react';

export const metadata = {
  title: 'Sign up | Capeo',
  description: 'Start managing your business with Capeo.',
};

export default function Page() {
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
    <div className="flex h-screen flex-col sm:flex-row">
      <section
        className="bg-primary hidden flex-grow bg-center bg-no-repeat sm:flex sm:w-auto"
        style={{
          backgroundImage: 'url(/assets/images/sign-in-banner.png)',
        }}
      ></section>

      <section className="flex h-screen w-full translate-y-0 transform flex-col justify-center px-8 opacity-100 transition-all duration-500 ease-in-out md:w-4/12">
        <div className="flex">
          <span className="text-primary text-3xl font-semibold">
            Create Account
          </span>
        </div>

        <p className="text-gray-600">
          Sign up to start managing your business.
        </p>

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
      </section>
    </div>
  );
}
