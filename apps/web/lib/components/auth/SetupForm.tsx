'use client';

import {
  CheckCircle,
  GraduationCap,
  Loader2,
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
  const [isNext, setIsNext] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();

  async function onSubmit({ institute, name }) {
    try {
      await makeAPICall(CREATE_ORGANIZATION, {
        name,
        institute,
      });
      router.push('/onboarding');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {!isNext && (
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
      )}
      {isNext && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <section>
            <div className="mb-3 flex justify-center">
              <p className="inter w-[50%] text-2xl font-semibold">
                Welcome to Acadx! Complete Your Profile for the Ultimate
                Experience
              </p>
            </div>
            <div className="flex py-2 "></div>
          </section>
          <section className="flex justify-center  py-2">
            <div className="mt-6 w-full px-12">
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="inter sub-text text-sm font-semibold">
                    Name
                  </label>
                  <Input
                    type="text"
                    className="mt-2"
                    placeholder="Enter your name"
                    {...register('name', {
                      required: 'Enter your name ',
                    })}
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
                <div>
                  <label className="inter sub-text text-sm font-semibold">
                    Phone
                  </label>
                  <Input
                    type="text"
                    className="mt-2"
                    placeholder="Enter your phone number"
                    {...register('phone', {
                      required: 'Enter your phone number',
                    })}
                  />
                  <p
                    className={`h-2 p-1 text-sm text-red-600 ${
                      errors.phone
                        ? 'opacity-100 transition-opacity duration-300'
                        : 'opacity-0 transition-opacity duration-300'
                    }`}
                  >
                    {errors.phone?.message as string}
                  </p>
                </div>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="inter sub-text text-sm font-semibold">
                    Preffered Domain
                  </label>
                  <Input
                    type="text"
                    className="mt-2"
                    placeholder="Domain name"
                    {...register('domain', {
                      required: 'Your domain is needed',
                    })}
                  />
                  <p
                    className={`h-2 p-1 text-sm text-red-600 ${
                      errors.domain
                        ? 'opacity-100 transition-opacity duration-300'
                        : 'opacity-0 transition-opacity duration-300'
                    }`}
                  >
                    {errors.domain?.message as string}
                  </p>
                </div>
                <div>
                  <label className="inter sub-text text-sm font-semibold">
                    Upload Logo
                  </label>
                  <Input
                    type="file"
                    className="mt-2"
                    {...register('logo', {
                      required: 'Your logo is needed',
                    })}
                  />
                  <p
                    className={`h-2 p-1 text-sm text-red-600 ${
                      errors.logo
                        ? 'opacity-100 transition-opacity duration-300'
                        : 'opacity-0 transition-opacity duration-300'
                    }`}
                  >
                    {errors.logo?.message as string}
                  </p>
                </div>
              </div>
              <div className="mb-6 grid grid-cols-1 gap-4">
                <div>
                  <label className="inter sub-text text-sm font-semibold">
                    Street/Address Line 1
                  </label>
                  <Input
                    type="text"
                    className="mt-2"
                    placeholder="Enter address line 1"
                    {...register('addressLine1', {
                      required: 'Your address line 1 is needed',
                    })}
                  />
                  <p
                    className={`h-2 p-1 text-sm text-red-600 ${
                      errors.addressLine1
                        ? 'opacity-100 transition-opacity duration-300'
                        : 'opacity-0 transition-opacity duration-300'
                    }`}
                  >
                    {errors.addressLine1?.message as string}
                  </p>
                </div>
                <div className="mt-2">
                  <label className="inter sub-text text-sm font-semibold">
                    Address Line 2
                  </label>
                  <Input
                    type="text"
                    className="mt-2"
                    placeholder="Enter address line 1"
                    {...register('addressLine2', {
                      required: 'Your address line 2 is needed',
                    })}
                  />
                  <p
                    className={`h-2 p-1 text-sm text-red-600 ${
                      errors.addressLine2
                        ? 'opacity-100 transition-opacity duration-300'
                        : 'opacity-0 transition-opacity duration-300'
                    }`}
                  >
                    {errors.addressLine2?.message as string}
                  </p>
                </div>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="inter sub-text text-sm font-semibold">
                    City
                  </label>
                  <Input
                    type="text"
                    className="mt-2"
                    placeholder="Enter city name"
                    {...register('city', {
                      required: 'Your city is needed',
                    })}
                  />
                  <p
                    className={`h-2 p-1 text-sm text-red-600 ${
                      errors.city
                        ? 'opacity-100 transition-opacity duration-300'
                        : 'opacity-0 transition-opacity duration-300'
                    }`}
                  >
                    {errors.city?.message as string}
                  </p>
                </div>
                <div>
                  <label className="inter sub-text text-sm font-semibold">
                    State
                  </label>
                  <Input
                    type="text"
                    className="mt-2"
                    placeholder="Enter state name"
                    {...register('state', {
                      required: 'Your state is needed',
                    })}
                  />
                  <p
                    className={`h-2 p-1 text-sm text-red-600 ${
                      errors.state
                        ? 'opacity-100 transition-opacity duration-300'
                        : 'opacity-0 transition-opacity duration-300'
                    }`}
                  >
                    {errors.state?.message as string}
                  </p>
                </div>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="inter sub-text text-sm font-semibold">
                    Postal ZIP code
                  </label>
                  <Input
                    type="text"
                    className="mt-2"
                    placeholder="Enter postal zip code"
                    {...register('postalCode', {
                      required: 'Your city is needed',
                    })}
                  />
                  <p
                    className={`h-2 p-1 text-sm text-red-600 ${
                      errors.postalCode
                        ? 'opacity-100 transition-opacity duration-300'
                        : 'opacity-0 transition-opacity duration-300'
                    }`}
                  >
                    {errors.postalCode?.message as string}
                  </p>
                </div>
                <div>
                  <label className="inter sub-text text-sm font-semibold">
                    Country
                  </label>
                  <Input
                    type="text"
                    className="mt-2"
                    placeholder="Enter country name"
                    {...register('country', {
                      required: 'Your state is needed',
                    })}
                  />
                  <p
                    className={`h-2 p-1 text-sm text-red-600 ${
                      errors.country
                        ? 'opacity-100 transition-opacity duration-300'
                        : 'opacity-0 transition-opacity duration-300'
                    }`}
                  >
                    {errors.country?.message as string}
                  </p>
                </div>
              </div>
              <div className="mt-12 flex justify-between gap-4">
                <Button
                  type="submit"
                  className="w-[114px] border border-2 border-gray-800 bg-transparent px-4 py-3 text-gray-800 hover:bg-transparent hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex h-screen items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                    </div>
                  ) : (
                    `Back`
                  )}
                </Button>
                <Button
                  type="submit"
                  className="w-[166px] px-4 py-3 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex h-screen items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                    </div>
                  ) : (
                    `Continue`
                  )}
                </Button>
              </div>
            </div>
          </section>
        </form>
      )}
    </>
  );
}
