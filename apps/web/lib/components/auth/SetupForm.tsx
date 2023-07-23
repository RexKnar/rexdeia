'use client';

import {
  CheckCircle,
  GraduationCap,
  Icon,
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
  IconComponent: Icon;
  isSelected: boolean;
  onClick: () => void;
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
            isSelected ? 'visible' : 'invisible'
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  async function onSubmit({ institute, name }) {
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
          {...register('name', { required: true })}
        />
        {errors.name && <p>Name is required</p>}
      </div>
      <div className="mt-6 w-full">
        <Button type="submit" className="w-full text-white">
          Next
        </Button>
      </div>
    </form>
  );
}
