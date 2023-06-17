import { Button, Input } from 'ui';

export const metadata = {
  title: 'Sign in | Capeo',
  description: 'Capeo is a business management platform for small businesses.',
};

export default function Page() {
  return (
    <div className="flex h-screen flex-col sm:flex-row">
      <section
        className="bg-primary hidden flex-grow sm:flex sm:w-auto"
        style={{
          backgroundImage: 'url(/assets/images/sign-in-banner.png)',
          backgroundRepeat: 'repeat',
        }}
      ></section>

      <section className="flex h-screen w-full translate-y-0 transform flex-col justify-center px-8 opacity-100 transition-all duration-500 ease-in-out md:w-4/12">
        <div className="flex">
          <span className="text-primary text-2xl font-semibold">Welcome</span>
        </div>

        <p className="text-gray-600">Sign in to your account to get started.</p>

        <form className="mt-4">
          <div>
            <label className="block text-gray-700">Email Address</label>
            <Input
              type="email"
              className="mt-2"
              placeholder="Enter your email address"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <Input
              type="password"
              className="mt-2"
              placeholder="Enter your password"
            />
          </div>
          <div className="mt-6 w-full">
            <Button
              type="submit"
              className="w-full text-white transition-transform duration-300 ease-in-out hover:scale-105"
            >
              Sign in
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
