'use client';

import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { useGetSectionsByClassIdSubjectIdQuery } from 'lib/queries/section/useGetSectionByClassIdSubjectIdQuery';
import { useGetSubjectListByClassIdQuery } from 'lib/queries/subjects/useGetSubjectListByClassIdQuery';
import { Loader2, PlusCircle, Search, Trash } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useState } from 'react';
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

import { AssignStaffToClassRequestModel } from '../../../../../../lib/domain/class';
import { useGetAllSectionByClassIdQuery } from '../../../../../../lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useCreateStaffMutationByClassIdQuery } from '../../../../../../lib/queries/staff/useCreateStaffMutationByClassIdQuery';
import { useGetAllStaffListQuery } from '../../../../../../lib/queries/staff/useGetAllStaffListQuery';

export function AssignStaffClassDetailPageFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const isOpen =
    searchParams.get('isAssignStaffClassDetailPageFlyoutOpen') === 'true';

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections' as never,
  });
  const classIdFromQueryParams = useParams<{ classId: string }>();
  const classIdFromSearchParams = searchParams.get('classId');
  const [subjectId, setSubjectId] = useState('');
  const classId = classIdFromSearchParams
    ? classIdFromSearchParams
    : classIdFromQueryParams?.classId;

  useEffect(() => {
    if (isOpen && fields.length === 0) {
      append({ sections: 'sections' });
    }
  }, [isOpen, fields, append]);

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 999;
  const filter = { isActive: true };

  const { mutateAsync: mutateCreateStaffsAsync } =
    useCreateStaffMutationByClassIdQuery(classId);

  const { data: getStaffListResponse } = useGetAllStaffListQuery({
    page,
    limit,
  });

  const { data: subjectListResponse } = useGetSubjectListByClassIdQuery(
    classId,
    {
      enabled: !!classId,
    }
  );
  const { data: batchesList } = useGetBatchesListQuery({
    page,
    limit,
    filter,
  });

  const { data: sectionListResponse } = useGetAllSectionByClassIdQuery(
    { classId, filter },
    {
      enabled: !!classId,
    }
  );
  const { data: sectionResponseByGroup } =
    useGetSectionsByClassIdSubjectIdQuery(
      { classId, subjectId },
      {
        enabled: !!subjectId,
      }
    );
  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('isAssignStaffClassDetailPageFlyoutOpen', 'false');
    params.delete('sectionId');
    setSubjectId('');
    router.replace(pathname + '?' + params.toString());
  };

  const assignStaff = async (payload: {
    sections: AssignStaffToClassRequestModel[];
  }) => {
    try {
      const AssignStaffPayload = {
        data: [...payload.sections],
      };

      await mutateCreateStaffsAsync(AssignStaffPayload);
    } finally {
      await closeFlyout();
      reset();
      setSubjectId('');
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
                            value={watch(`sections.${index}.staffId`)}
                            {...register(`sections.${index}.staffId` as any, {
                              required: true,
                            })}
                            onValueChange={(value) => {
                              if (value) {
                                setValue(
                                  `sections.${index}.staffId` as any,
                                  value
                                );
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

                        <p>
                          {errors[
                            `sections.${index}.staffId`
                          ]?.message.toString()}
                        </p>
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
                            value={watch(`sections.${index}.subjectId`)}
                            {...register(`sections.${index}.subjectId` as any)}
                            onValueChange={(value) => {
                              if (value) {
                                setSubjectId(value);
                                setValue(
                                  `sections.${index}.subjectId` as any,
                                  value
                                );
                              }
                            }}
                          >
                            <SelectTrigger className="mt-2 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {subjectListResponse?.map((item) => (
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
                          {errors[
                            `sections.${index}.subjectId`
                          ]?.message.toString()}
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
                        {sectionResponseByGroup?.length ? (
                          sectionResponseByGroup?.map((item) => (
                            <label className="me-5" key={item.id}>
                              <Controller
                                key={item.id}
                                control={control}
                                name={`sections.${index}.sectionIds` as any}
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
                          ))
                        ) : (
                          <div className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
                            <p className="text-black ">
                              Please Select Subject...
                            </p>
                          </div>
                        )}
                      </div>
                      {errors[`sections.${index}.sections`] && (
                        <p>
                          {errors[
                            `sections.${index}.sections`
                          ]?.message.toString()}
                        </p>
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
                        {sectionListResponse?.data?.map((item) => (
                          <label className="me-5" key={item.id}>
                            <Controller
                              key={item.id}
                              control={control}
                              name={`sections.${index}.sectionInCharge` as any}
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
                      {errors[`sections.${index}.sectionInCharge`] && (
                        <p>
                          {errors[
                            `sections.${index}.sectionInCharge`
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
                          {...register(
                            `sections.${index}.academicYearId` as any,
                            {
                              required: true,
                            }
                          )}
                          onValueChange={(value) => {
                            if (value) {
                              setValue(
                                `sections.${index}.academicYearId` as any,
                                value
                              );
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
                        {errors[
                          `sections.${index}.academicYearId`
                        ]?.message.toString()}
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
