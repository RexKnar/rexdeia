'use client';

import {
  GraduationCap,
  Loader2,
  PersonStanding,
  School,
  School2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from 'ui';
import { titilize } from 'utils';

import { makeAPICall } from '../../api';
import { UPDATE_BRANCH, UPDATE_ORGANIZATION } from '../../endpoints';
import { InstituteCard } from './InstituteCard';

type SetupFormProps = {
  branchId: string;
  organizationId: string;
};

export function SetupForm({ branchId, organizationId }: SetupFormProps) {
  const router = useRouter();
  const { update, status } = useSession();
  const [isSessionUpdated, setIsSessionUpdated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [selected, setSelected] = useState('school');

  async function onSubmit({ institute, name }) {
    try {
      const updateOrganization = makeAPICall(
        UPDATE_ORGANIZATION,
        {
          name,
          institute,
        },
        {},
        {
          organizationId,
        }
      );

      const updateBranch = makeAPICall(
        UPDATE_BRANCH,
        { name: 'Default' },
        {},
        { branchId }
      );

      await Promise.all([updateOrganization, updateBranch]);

      router.push(`/onboarding`);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && !isSessionUpdated) {
      update({
        branchId,
        organizationId,
      });
      setIsSessionUpdated(true);
    }
    // This is intentional as we wanted to update the session only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isSessionUpdated]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <section>
        <div className="mb-3 mt-36 flex justify-center">
          <p className="inter text-2xl font-semibold">
            Please select the type of account you are creating.
          </p>
        </div>
        <div className="flex justify-center py-2">
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
            name="Individuals"
            IconComponent={PersonStanding}
            isSelected={selected === 'individuals'}
            onClick={() => setSelected('individuals')}
          />
          <InstituteCard
            name="Other Institutes"
            IconComponent={School}
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
            `Proceed`
          )}
        </Button>
      </div>
    </form>
  );
}
