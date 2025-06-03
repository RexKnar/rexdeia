'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AssignLearnerModel } from 'lib/domain/learner';
import { useGetInstituteCourseListQuery } from 'lib/queries/institute/course/useGetInstituteCourseListQuery';
import { useAssignLearnerMutationQuery } from 'lib/queries/institute/learners/useAssignLearnerMutationQuery';
import { Contact, Loader2, Save, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Else, If, Then } from 'react-if';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from 'ui';

export function AssignLearnerFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      firstName: null,
      middleName: null,
      lastName: null,
      emailId: null,
      phoneNumber: null,
      aadharCardNumber: null,
      gender: null,
      dob: null,
      paymentType: null,
      paymentMethod: 'Cash',
      paymentDate: null,
      paidAmount: 0,
      discountAmount: null,
      courseId: null,
      referenceId: null,
    },
  });

  const isOpen = searchParams.get('isAssignLearnerFlyoutOpen') === 'true';
  // const courseId = searchParams.get('courseId');

  const page = parseInt(searchParams.get('page')) || 1;

  const [courseList, setCourseList] = useState<any>([]);

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isAssignLearnerFlyoutOpen', 'false');
    params.delete('groupId');

    router.replace(pathname + '?' + params.toString());
  };
  const { data: courseListResponse } = useGetInstituteCourseListQuery({
    page: 1,
    limit: 999,
    filter: {
      isActive: true,
    },
  });

  const {
    isPending: isPendingAssignLearner,
    mutateAsync: mutateAssignLearnerAsync,
  } = useAssignLearnerMutationQuery(page);

  async function assignLearner(payload: AssignLearnerModel) {
    try {
      const requestPayload = {
        ...payload,
      };
      await mutateAssignLearnerAsync(requestPayload);
    } catch (error) {
      console.error(error);
    } finally {
      closeFlyout();
      reset();
    }
  }

  useEffect(() => {
    setCourseList(courseListResponse?.data);
  }, [courseListResponse]);
  return (
    <section>
      <Dialog.Root open={isOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 backdrop-blur-sm backdrop-brightness-95" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-50 h-[85vh] w-[80vw] translate-x-[-50%] translate-y-[-50%]  rounded-[6px] bg-gray-50 p-[25px] focus:outline-none">
            <Dialog.Title className="m-0 flex items-center justify-between">
              <section className="relative flex items-center">
                <section className="absolute bottom-0 left-0 top-0 flex items-center justify-center">
                  <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-gray-300 text-primary">
                    <Contact className="h-5 w-5" />
                  </div>
                </section>
                <Text className="ml-12" variant="base-medium">
                  Assign New Learner
                </Text>
              </section>
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  aria-label="Close"
                  disabled={isPendingAssignLearner}
                  aria-disabled={isPendingAssignLearner}
                  onClick={() => closeFlyout()}
                  className="h-8 w-8 rounded-full bg-gray-400 p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </Dialog.Close>
            </Dialog.Title>
            <form onSubmit={handleSubmit(assignLearner)}>
              <section className="max-h-[70vh] overflow-y-auto">
                <section className="mt-10 ">
                  <h2 className="text-sm ">Personal Information</h2>
                  <hr className="border-t border-gray-300"></hr>
                  <div className="mt-5 grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="text-sm font-semibold text-gray-700"
                      >
                        First Name
                      </label>
                      <Input
                        {...register('firstName', {
                          required: 'First Name is Required',
                        })}
                        autoFocus
                        className="mt-2"
                        id="firstName"
                        errorMessage={fieldErrors?.firstName?.message.toString()}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="middleName"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Middle Name
                      </label>
                      <Input
                        {...register('middleName')}
                        autoFocus
                        className="mt-2"
                        id="middleName"
                        errorMessage={fieldErrors?.middleName?.message.toString()}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Last Name
                      </label>
                      <Input
                        {...register('lastName')}
                        autoFocus
                        className="mt-2"
                        id="lastName"
                        errorMessage={fieldErrors?.lastName?.message.toString()}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="emailId"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Email Id
                      </label>
                      <Input
                        {...register('emailId', {
                          required: 'Email is Required',
                        })}
                        autoFocus
                        className="mt-2"
                        id="emailId"
                        errorMessage={fieldErrors?.emailId?.message.toString()}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Phone Number
                      </label>
                      <Input
                        {...register('phoneNumber', {
                          required: 'Phone Number is Required',
                        })}
                        autoFocus
                        className="mt-2"
                        id="phoneNumber"
                        errorMessage={fieldErrors?.phoneNumber?.message.toString()}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="aadharCardNumber"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Aadhar Card Number
                      </label>
                      <Input
                        {...register('aadharCardNumber', {
                          required: 'Aadhar Card Number is Required',
                        })}
                        autoFocus
                        className="mt-2"
                        id="aadharCardNumber"
                        errorMessage={fieldErrors?.aadharCardNumber?.message.toString()}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="gender"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Gender
                      </label>
                      <Select
                        autoComplete="off"
                        {...register('gender', {
                          required: 'Gender is required',
                        })}
                        value={watch('gender')}
                        onValueChange={(value) => {
                          if (value) {
                            setValue('gender', value);
                          }
                        }}
                      >
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="-">Not Mention</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldErrors['gender'] && (
                        <p className="h-2 p-1 text-sm text-red-600">
                          {fieldErrors['gender'].message as string}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="dob"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Date of Birth
                      </label>
                      <Input
                        {...register('dob', {
                          required: 'Date of Birth is Required',
                        })}
                        autoFocus
                        type="date"
                        className="mt-2"
                        id="dob"
                        errorMessage={fieldErrors?.dob?.message.toString()}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="paymentMethod"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Gender
                      </label>
                      <Select
                        autoComplete="off"
                        {...register('paymentMethod', {
                          required: 'Payment Method is required',
                        })}
                        value={watch('paymentMethod')}
                        onValueChange={(value) => {
                          if (value) {
                            setValue('paymentMethod', value);
                          }
                        }}
                      >
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Online">Online</SelectItem>
                            <SelectItem value="Free">Free</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldErrors['paymentMethod'] && (
                        <p className="h-2 p-1 text-sm text-red-600">
                          {fieldErrors['gender'].message as string}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
                <section className="mt-10">
                  <h2 className="text-sm ">Course Information</h2>
                  <hr className="border-t border-gray-300"></hr>
                  <div className="mt-5 grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3">
                    <div>
                      <label
                        htmlFor="course"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Choose a Course
                      </label>
                      <Select
                        autoComplete="off"
                        {...register('courseId', {
                          required: 'Course is required',
                        })}
                        value={watch('courseId')}
                        onValueChange={(value) => {
                          if (value) {
                            setValue('courseId', value);
                          }
                        }}
                      >
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {courseList?.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.courseName}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldErrors['courseId'] && (
                        <p className="h-2 p-1 text-sm text-red-600">
                          {fieldErrors['courseId'].message as string}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="course"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Batch
                      </label>
                      <Select autoComplete="off">
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="batchTraining">
                              Batch Training
                            </SelectItem>
                            <SelectItem value="recorded">
                              Recorded Course
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label
                        htmlFor="discountAmount"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Discounted Course Free
                      </label>
                      <Input
                        {...register('discountAmount', {
                          required: 'Discounted Course Fee is Required',
                        })}
                        autoFocus
                        type="number"
                        className="mt-2"
                        id="discountAmount"
                        errorMessage={fieldErrors?.discountAmount?.message.toString()}
                      />
                    </div>
                  </div>
                </section>
                <section className="mt-10">
                  <h2 className="text-sm ">Payment Information</h2>
                  <hr className="border-t border-gray-300"></hr>
                  <div className="mt-5 grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3">
                    <div>
                      <label
                        htmlFor="paymentType"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Payment Type
                      </label>
                      <Select
                        autoComplete="off"
                        {...register('paymentType', {
                          required: 'Course is required',
                        })}
                        value={watch('paymentType')}
                        onValueChange={(value) => {
                          if (value) {
                            setValue('paymentType', value);
                          }
                        }}
                      >
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Term">Term Payment</SelectItem>
                            <SelectItem value="FullPayment">
                              Full Payment
                            </SelectItem>
                            <SelectItem value="Free">Free</SelectItem>
                            <SelectItem value="CardEMI">Card EMI</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldErrors['paymentType'] && (
                        <p className="h-2 p-1 text-sm text-red-600">
                          {fieldErrors['paymentType'].message as string}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="paymentMethod"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Payment Method
                      </label>
                      <Select
                        autoComplete="off"
                        {...register('paymentMethod', {
                          required: 'Payment Method is required',
                        })}
                        value={watch('paymentMethod')}
                        onValueChange={(value) => {
                          if (value) {
                            setValue('paymentMethod', value);
                          }
                        }}
                      >
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Online">Online</SelectItem>
                            <SelectItem value="Free">Free</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldErrors['paymentMethod'] && (
                        <p className="h-2 p-1 text-sm text-red-600">
                          {fieldErrors['paymentMethod'].message as string}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="paidAmount"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Amount Paid
                      </label>
                      <Input
                        {...register('paidAmount', {
                          required: ' Amount Paid Is Required',
                        })}
                        autoFocus
                        type="number"
                        className="mt-2"
                        id="paidAmount"
                        errorMessage={fieldErrors?.paidAmount?.message.toString()}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="paymentDate"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Paid Date
                      </label>
                      <Input
                        {...register('paymentDate', {
                          required: 'Paid Date is Required',
                        })}
                        autoFocus
                        type="date"
                        className="mt-2"
                        id="paymentDate"
                        errorMessage={fieldErrors?.paymentDate?.message.toString()}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="referenceId"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Recept Number / Reference Id / Payment Id
                      </label>
                      <Input
                        {...register('referenceId', {
                          required: 'Payment Id is Required',
                        })}
                        autoFocus
                        type="text"
                        className="mt-2"
                        id="referenceId"
                        errorMessage={fieldErrors?.referenceId?.message.toString()}
                      />
                    </div>
                  </div>
                </section>
              </section>
              <section className="mt-10 flex justify-center gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="border-red-600 text-red-600"
                  onClick={() => closeFlyout()}
                >
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-600" />
                    <Text variant="base-regular" className="text-red-600">
                      Cancel
                    </Text>
                  </div>
                </Button>
                <Button variant="default">
                  <div className="flex items-center gap-2">
                    <If condition={isPendingAssignLearner}>
                      <Then>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </Then>
                      <Else>
                        <Save className="h-4 w-4" />
                      </Else>
                    </If>
                    <Text variant="base-regular">Submit</Text>
                  </div>
                </Button>
              </section>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
