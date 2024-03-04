'use client';

import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { PlusCircle, Search, Trash } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from 'ui';

import { LinkStaffModel } from '../../../../../../lib/domain/class';
import { useGetAllSectionByClassIdQuery } from '../../../../../../lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useCreateStaffMutationByClassIdQuery } from '../../../../../../lib/queries/staff/useCreateStaffMutationByClassIdQuery';
import { useGetAllStaffListQuery } from '../../../../../../lib/queries/staff/useGetAllStaffListQuery';
import { useGetSubjectListQuery } from '../../../../../../lib/queries/subjects/useGetSubjectListQuery';

export function AssignStaffClassDetailPageFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    control,
    watch,
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const isOpen =
    searchParams.get('isAssignStaffClassDetailPageFlyoutOpen') === 'true';

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'section' as never,
  });

  useEffect(() => {
    if (isOpen && fields.length === 0) {
      append({ section: 'section' });
    }
  }, [isOpen, fields, append]);

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const { mutateAsync: mutateCreateStaffsAsync } =
    useCreateStaffMutationByClassIdQuery();

  const { data: getStaffListResponse } = useGetAllStaffListQuery({
    page,
    limit,
  });
  const { data: subjectListResponse } = useGetSubjectListQuery({
    page,
    limit,
  });
  const { data: batchesList } = useGetBatchesListQuery({
    page,
    limit,
  });
  const params = useParams<{ classId: string }>();

  const { data: sectionListResponse } = useGetAllSectionByClassIdQuery(
    params.classId,
    {
      enabled: !!params.classId,
    }
  );
  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('isAssignStaffClassDetailPageFlyoutOpen', 'false');
    params.delete('sectionId');
    reset();
    router.replace(pathname + '?' + params.toString());
  };

  const assignStaff = async (formValues: any) => {
    try {
      const payload = {
        data: formValues,
        classId: params.classId,
      };
      mutateCreateStaffsAsync(payload as LinkStaffModel & { classId: string });
    } finally {
      await closeFlyout();
      reset();
    }
  };

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeFlyout()}
        >
          <div className="max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit(assignStaff)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Assign Staff
                    </Text>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300" />
              </SheetHeader>
              <div className="mt-8">
                {fields.map((row, index) => (
                  <section key={row.id}>
                    <div className="mt-5 flex gap-4">
                      <div className="w-full">
                        <label
                          htmlFor="searchStaff"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Search staff
                        </label>
                        <div className="relative w-full">
                          <Select
                            autoComplete="off"
                            {...register(`${index}.staffId`, {
                              required: true,
                            })}
                            value={watch(`${index}.staffId`)}
                            onValueChange={(value) => {
                              if (value) {
                                setValue(`${index}.staffId`, value);
                              }
                            }}
                          >
                            <SelectTrigger className="mt-2 w-full" key={index}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {getStaffListResponse?.data?.map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    {item.firstName}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <Search className="text-primary-200" size={20} />
                          </div>
                        </div>

                        <p>{errors[`${index}.staffId`]?.message.toString()}</p>
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="subjectName"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Subject Name
                        </label>
                        <div className="relative w-full">
                          <Select
                            autoComplete="off"
                            {...register(`${index}.subjectId`, {
                              required: true,
                            })}
                            value={watch(`${index}.subjectId`)}
                            onValueChange={(value) => {
                              if (value) {
                                setValue(`${index}.subjectId`, value);
                              }
                            }}
                          >
                            <SelectTrigger className="mt-2 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {subjectListResponse?.data?.map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <Search className="text-primary-200" size={20} />
                          </div>
                        </div>

                        <p>
                          {errors[`${index}.subjectId`]?.message.toString()}
                        </p>
                      </div>
                      {fields.length > 1 ? (
                        <div className="mt-8">
                          <Button
                            className="border-transparent bg-red-600 px-2"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <Trash
                              size={20}
                              className="text-center text-white"
                            />
                          </Button>
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="description"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Sections
                      </label>
                      <div className="mt-2 flex flex-wrap" id="sectionId">
                        {sectionListResponse?.map((item) => (
                          <label className="me-5" key={item.id}>
                            <Controller
                              key={item.id}
                              control={control}
                              name={`${index}.sections`}
                              render={({ field }) => {
                                return (
                                  <label className="me-5">
                                    <Checkbox
                                      className="me-2 items-center space-x-2 rounded border border-primary-500"
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                    <span>{item.name}</span>
                                  </label>
                                );
                              }}
                            />
                          </label>
                        ))}
                      </div>
                      {errors[`${index}.sections`] && (
                        <p>{errors[`${index}.sections`]?.message.toString()}</p>
                      )}
                    </div>
                    <div className="mt-1">
                      <label
                        htmlFor="subjectName"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Class InCharge
                      </label>
                      <div className="mt-2 flex flex-wrap" id="sectionId">
                        {sectionListResponse?.map((item) => (
                          <label className="me-5" key={item.id}>
                            <Controller
                              key={item.id}
                              control={control}
                              name={`${index}.sectionInCharge`}
                              render={({ field }) => {
                                return (
                                  <label className="me-5">
                                    <Checkbox
                                      className="me-2 items-center space-x-2 rounded border border-primary-500"
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                    <span>{item.name}</span>
                                  </label>
                                );
                              }}
                            />
                          </label>
                        ))}
                      </div>
                      {errors[`${index}.sectionInCharge`] && (
                        <p>
                          {errors[
                            `${index}.sectionInCharge`
                          ]?.message.toString()}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="AcademicYear"
                        className="text-sm font-semibold text-gray-700"
                      >
                        AcademicYear
                      </label>
                      <div className="relative w-full">
                        <Select
                          autoComplete="off"
                          {...register(`${index}.academicYearId`, {
                            required: true,
                          })}
                          value={watch(`${index}.academicYearId`)}
                          onValueChange={(value) => {
                            if (value) {
                              setValue(`${index}.academicYearId`, value);
                            }
                          }}
                        >
                          <SelectTrigger className="mt-2 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {batchesList?.data?.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <Search className="text-primary-200" size={20} />
                        </div>
                      </div>

                      <p>
                        {errors[`${index}.academicYearId`]?.message.toString()}
                      </p>
                    </div>
                  </section>
                ))}
              </div>
              <div className="mt-5">
                <Button
                  size="sm"
                  variant="outline"
                  className="mx-auto flex justify-center px-4 py-2"
                  onClick={() => {
                    append({ section: 'section' });
                  }}
                >
                  <Text variant="sm-bold" className="text-center text-primary">
                    Add New
                  </Text>
                </Button>
              </div>
              <div className="mt-16">
                <Button
                  type="submit"
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
