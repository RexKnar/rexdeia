'use client';

import {
  CheckCircle,
  GraduationCap,
  LucideIcon,
  PersonStanding,
  School2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { cn, titilize } from 'utils';
import { Button, Input } from 'ui';
import { CREATE_ORGANIZATION } from '../../endpoints';
import { makeAPICall } from '../../api';
import { useRouter } from 'next/navigation';

type InstituteCardProps = {
  name: string;
  isSelected: boolean;
  onClick: () => void;
  IconComponent: LucideIcon;
};

function InstituteCard(props: InstituteCardProps) {
  const { IconComponent, isSelected, name, onClick } = props;
  const selectedStyle = 'border-primary-500 text-primary-600';

  return (
    <section className="bg-card text-card-foreground relative mr-2 flex cursor-pointer rounded-md border p-4 text-gray-600 shadow">
      <section
        onClick={onClick}
        className={`flex flex-col items-center justify-center px-5 ${
          isSelected ? selectedStyle : ''
        }`}
      >
        <div
          className={cn(
            'absolute left-2 top-0 mt-2',
            isSelected ? 'visible' : 'invisible',
          )}
        >
          <CheckCircle />
        </div>
        <div className="font-normal">{name}</div>
        <IconComponent className="h-12 w-12 font-normal" strokeWidth={1} />
      </section>
    </section>
  );
}

export function SetupForm() {
  const [selected, setSelected] = useState('school');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  async function onSubmit({ institute, name }) {
    setIsSubmitting(true);
    try {
      await makeAPICall(CREATE_ORGANIZATION, {
        name,
        institute,
      });
      debugger;
      router.push('/onboarding');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <section>
        <label className="block text-gray-700">Looking for</label>
        <div className="flex py-2">
          <InstituteCard
            name="School"
            IconComponent={School2}
            isSelected={selected === 'school'}
            onClick={() => setSelected('school')}
          />
          <InstituteCard
            name="College"
            IconComponent={GraduationCap}
            isSelected={selected === 'college'}
            onClick={() => setSelected('college')}
          />
          <InstituteCard
            name="Others"
            IconComponent={PersonStanding}
            isSelected={selected === 'others'}
            onClick={() => setSelected('others')}
          />
        </div>
        <input type="hidden" {...register('institute')} value={selected} />
      </section>

      <div>
        <label className="block text-gray-700">{`${
          selected === 'others' ? 'Institute' : titilize(selected)
        }'s name`}</label>
        <Input
          type="text"
          className="mt-2"
          placeholder={`Enter name of the ${
            selected === 'others' ? 'institute' : selected
          }`}
          {...register('name', { required: 'Name is required' })}
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
    </form>
  );
}