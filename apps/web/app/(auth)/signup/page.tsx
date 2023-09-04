import { SignUpForm } from '../../../lib/components/auth/SignUpForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import logo from '../../../public/assets/images/acadx-logo.png';
import { Button } from 'ui';
export const metadata = {
  title: 'Capeo | Sign up',
  description: 'Start managing your business with Capeo.',
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/');
  }

  return (
    <div className="flex h-full flex-col sm:flex-row">
      <section
        className="hidden flex-grow bg-center bg-no-repeat sm:flex sm:w-auto"
        style={{
          backgroundImage: 'url(/assets/images/signin-banner.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      ></section>

      <section className="flex h-full w-full translate-y-0 transform flex-col justify-between p-12 opacity-100 transition-all duration-500 ease-in-out md:w-4/12">
        <div>
          <Image src={logo} alt={'logo'} width={150}></Image>
        </div>
        <div className="mt-8 flex">
          <span className=" inter text-3xl font-semibold">
            Create Your Account
          </span>
        </div>

        <p className="inter text-base font-medium text-gray-800">
          Join the Acadx community and embark on a seamless academic experience.
        </p>

        <SignUpForm />
        <p className="inter mt-12 text-center text-base font-semibold text-gray-800">
          Have an account?
        </p>
        <Button
          type="submit"
          className="text-primary mt-3 w-full bg-transparent bg-transparent outline outline-gray-300 hover:text-white"
        >
          Signin
        </Button>
        <p className="inter mt-14 text-center text-base font-normal text-gray-700">
          &copy; acadx 2023
        </p>
      </section>
    </div>
  );
}
