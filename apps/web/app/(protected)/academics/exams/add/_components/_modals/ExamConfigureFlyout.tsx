'use client';

import { PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Switch,
  Text,
} from 'ui';

export function ExamConfigureFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isExamConfigureFlyoutOpen') === 'true';
  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm();
  const [practical, setPractical] = useState(false);
  const [theory, setTheory] = useState(true);

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isExamConfigureFlyoutOpen', 'false');
    reset();

    router.replace(pathname + '?' + params.toString());
  };

  async function saveExamConfigure() {
    closeFlyout();
  }
  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeFlyout()}
        >
          <div className="max-h-[95vh] overflow-y-auto">
            <form onSubmit={handleSubmit(saveExamConfigure)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        Exam Configuration
                      </Text>
                    </div>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300"></hr>
              </SheetHeader>
              <div className="mt-5 p-1">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold">
                    Subject Name
                  </label>
                </div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Total mark
                </label>
                <Input
                  {...register('totalmark', {
                    required: 'Total mark is Required',
                  })}
                  id="name"
                  autoFocus
                  type="text"
                  className="mt-2"
                  placeholder="Total mark"
                  errorMessage={fieldErrors?.totalmark?.message.toString()}
                />
                <div className="mt-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Mark to Conduct
                  </label>
                  <Input
                    {...register('markToConduct', {
                      required: 'Mark to Conduct is Required',
                    })}
                    id="name"
                    type="text"
                    className="mt-2"
                    placeholder="Mark to Conduct"
                    errorMessage={fieldErrors?.markToConduct?.message.toString()}
                  />
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Min Pass Mark
                  </label>
                  <Input
                    {...register('minPassMark', {
                      required: 'Min Pass Mark is Required',
                    })}
                    id="name"
                    type="text"
                    className="mt-2"
                    placeholder="Min Pass Mark"
                    errorMessage={fieldErrors?.minPassMark?.message.toString()}
                  />
                </div>
                <div className="mt-1 flex justify-end">
                  <label className="text-sm font-medium text-gray-600">
                    From conducting mark
                  </label>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-around">
                <div className="flex items-center">
                  <Switch
                    id="theory"
                    checked={theory}
                    onCheckedChange={(value) => {
                      setTheory(value);
                      setValue('theory', value);
                    }}
                  />
                  <label
                    htmlFor="theory"
                    className="ml-2 text-sm font-semibold"
                  >
                    Theory
                  </label>
                </div>
                <div className="flex items-center">
                  <Switch
                    id="practical"
                    onCheckedChange={(value) => {
                      setPractical(value);
                      setValue('practical', value);
                    }}
                  />
                  <label
                    htmlFor="practical"
                    className="ml-2 text-sm font-semibold"
                  >
                    Practical
                  </label>
                </div>
              </div>
              {theory && (
                <div className="mt-5 p-1">
                  <div>
                    <label htmlFor="name" className="text-sm font-semibold">
                      Theory
                    </label>
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Marks to conduct
                    </label>
                    <Input
                      {...register('markInTheory', {
                        required: 'Mark to Conduct is Required',
                      })}
                      id="name"
                      autoFocus
                      type="text"
                      className="mt-2"
                      placeholder="Marks to conduct"
                      errorMessage={fieldErrors?.markInTheory?.message.toString()}
                    />
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Convert Mark to
                    </label>
                    <Input
                      {...register('convertMarkInTheory', {
                        required: 'Convert Mark to is Required',
                      })}
                      id="name"
                      type="text"
                      className="mt-2"
                      placeholder="Convert Mark to"
                      errorMessage={fieldErrors?.convertMarkInTheory?.message.toString()}
                    />
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Min Pass Mark
                    </label>
                    <Input
                      {...register('passMarkInThory', {
                        required: 'Min Pass Mark is Required',
                      })}
                      id="name"
                      type="text"
                      className="mt-2"
                      placeholder="Min Pass Mark"
                      errorMessage={fieldErrors?.passMarkInThory?.message.toString()}
                    />
                  </div>
                  <div className="mt-1 flex justify-end">
                    <label className="text-sm font-medium text-gray-600">
                      From conducting mark
                    </label>
                  </div>
                </div>
              )}
              {practical && (
                <div className="mt-5 p-1">
                  <div>
                    <label htmlFor="name" className="text-sm font-semibold">
                      Practical
                    </label>
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Marks to conduct
                    </label>
                    <Input
                      {...register('markInPractical', {
                        required: 'Mark to Conduct is Required',
                      })}
                      id="name"
                      autoFocus
                      type="text"
                      className="mt-2"
                      placeholder="Marks to conduct"
                      errorMessage={fieldErrors?.markInPractical?.message.toString()}
                    />
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Convert Mark to
                    </label>
                    <Input
                      {...register('convertMarkInPractical', {
                        required: 'Convert Mark to is Required',
                      })}
                      id="name"
                      type="text"
                      className="mt-2"
                      placeholder="Convert Mark to"
                      errorMessage={fieldErrors?.convertMarkInPractical?.message.toString()}
                    />
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Min Pass Mark
                    </label>
                    <Input
                      {...register('passMarkInPractical', {
                        required: 'Min Pass Mark is Required',
                      })}
                      id="name"
                      type="text"
                      className="mt-2"
                      placeholder="Min Pass Mark"
                      errorMessage={fieldErrors?.passMarkInPractical?.message.toString()}
                    />
                  </div>
                  <div className="mt-1 flex justify-end">
                    <label className="text-sm font-medium text-gray-600">
                      From conducting mark
                    </label>
                  </div>
                </div>
              )}
              <div className="mt-10">
                <Button
                  size="lg"
                  variant="default"
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  Save & Close
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
