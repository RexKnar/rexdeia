'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Input,
  RadioGroup,
  RadioGroupItem,
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
import * as z from 'zod';

import { CreateSubjectModel } from '../../../../../../lib/domain/subject';
import { useGetAssessmentFormatList } from '../../../../../../lib/queries/assessment-format/useGetAssessmentFormatList';
import { useGetGroupListQuery } from '../../../../../../lib/queries/group/useGetGroupListQuery';
import { useGetRegulationListQuery } from '../../../../../../lib/queries/regulations/useGetRegulationListQuery';
import { useGetAllSectionByClassIdQuery } from '../../../../../../lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useGetSubjectTypeList } from '../../../../../../lib/queries/subject-type/useGetSubjectTypeQuery';
import { useCreateSubjectMutationByClassIdQuery } from '../../../../../../lib/queries/subjects/useCreateSubjectMutationByClassIdQuery';

const schema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(1),
  subjectTypeId: z
    .string({
      required_error: 'Subject Type is required',
    })
    .min(1),
  assessmentFormatIds: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'Assessment Format is required',
    }),
  groupIds: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Group is required',
  }),
  regulationId: z
    .string({
      required_error: 'regulation is required',
    })
    .min(1),
  sectionIds: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'Section is required',
    }),
  elective: z
    .string({
      required_error: 'elective is required',
    })
    .min(1),
});

type SchemaType = z.infer<typeof schema>;

export function AddSubjectFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get('isAddSubjectFlyoutOpen') === 'true';
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const filter = {};
  const {
    control,
    watch,
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      assessmentFormatIds: [],
      groupIds: [],
      sectionIds: [],
    },
  });

  const { mutateAsync: mutateCreateSubjectsAsync } =
    useCreateSubjectMutationByClassIdQuery();

  const { data: subjectTypeList } = useGetSubjectTypeList({
    page: 1,
    limit: 999,
    filter,
  });

  const { data: assessmentFormatList } = useGetAssessmentFormatList({
    page: 1,
    limit: 999,
    filter,
  });
  const { data: groupList } = useGetGroupListQuery({
    page: 1,
    limit: 999,
    filter,
  });

  const classId = useParams<{ classId: string }>().classId;
  const { data: sectionListResponse } = useGetAllSectionByClassIdQuery(
    { classId, filter },
    {
      enabled: !!classId,
    }
  );

  const { data: regulationListResponse } = useGetRegulationListQuery({
    page,
    limit,
    filter,
  });

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('isAddSubjectFlyoutOpen', 'false');
    params.delete('sectionId');
    reset();
    router.replace(pathname + '?' + params.toString());
  };

  const saveSubject = async (payload: CreateSubjectModel) => {
    try {
      const addSubjectRequestPayload = {
        ...payload,
        elective: payload.elective,
      };

      const requestPayload = {
        subjects: [
          {
            ...addSubjectRequestPayload,
            isActive: true,
          },
        ],
        classId: classId,
      };

      await mutateCreateSubjectsAsync(requestPayload);
    } finally {
      reset();
      closeFlyout();
    }
  };

  useEffect(() => {
    register('sectionIds');
  }, [register]);

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeFlyout()}
        >
          <form onSubmit={handleSubmit(saveSubject)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      New Subject
                    </Text>
                  </div>
                </div>
              </SheetTitle>
              <hr className="border-t border-gray-300"></hr>
            </SheetHeader>
            <div className="max-h-[75vh] overflow-y-auto">
              <div className="mt-5">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Subject Name
                  </label>
                  <Input
                    {...register('name')}
                    id="name"
                    autoFocus
                    required
                    type="text"
                    className="mt-2"
                    placeholder="Enter Subject Name"
                    errorMessage={fieldErrors?.name?.message.toString()}
                  />
                </div>
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
                      <Checkbox
                        className="me-2 items-center space-x-2 rounded border border-primary-500"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setValue('sectionIds', [
                              ...watch('sectionIds'),
                              item.id,
                            ]);
                          } else {
                            setValue(
                              'sectionIds',
                              watch('sectionIds').filter(
                                (value) => value !== item.id
                              )
                            );
                          }
                        }}
                      />
                      <span>{item.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="type"
                  className="text-sm font-semibold text-gray-700"
                >
                  Regulation
                </label>
                <Select
                  autoComplete="off"
                  {...register('regulationId', { required: true })}
                  value={watch('regulationId')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('regulationId', value);
                    }
                  }}
                >
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {regulationListResponse?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.regulationName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="type"
                  className="text-sm font-semibold text-gray-700"
                >
                  Subject Type
                </label>
                <Select
                  autoComplete="off"
                  {...register('subjectTypeId', { required: true })}
                  value={watch('subjectTypeId')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('subjectTypeId', value);
                    }
                  }}
                >
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {subjectTypeList?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="py-4">
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-gray-700"
                >
                  Subject Format
                </label>
                <div className="mt-2 flex flex-wrap">
                  {assessmentFormatList?.data?.map((item) => (
                    <Controller
                      key={item.id}
                      control={control}
                      name="assessmentFormatIds"
                      render={({ field }) => {
                        return (
                          <label className="me-5">
                            <Checkbox
                              className="me-2 items-center space-x-2 rounded border border-primary-500"
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
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
                  ))}
                </div>
              </div>
              <div className="pt-3">
                <label
                  htmlFor="group"
                  className="text-sm font-semibold text-gray-700"
                >
                  Group
                </label>
                <div className="mt-2 flex flex-wrap">
                  {groupList?.data?.map((item) => (
                    <Controller
                      key={item.id}
                      control={control}
                      name="groupIds"
                      render={({ field }) => {
                        return (
                          <label className="me-5">
                            <Checkbox
                              className="me-2 items-center space-x-2 rounded border border-primary-500"
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
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
                  ))}
                </div>
                <div className="mt-7">
                  <RadioGroup defaultValue="0">
                    <div className="flex">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" {...register('elective')} />
                        <label
                          htmlFor="Elective"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Elective
                        </label>
                      </div>
                      <div className="ml-5 flex items-center space-x-2">
                        <RadioGroupItem value="2" {...register('elective')} />
                        <label
                          htmlFor="Non-Elective"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Non-Elective
                        </label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div className="mt-10 flex justify-center ">
              <Button
                size="default"
                variant="default"
                type="submit"
                className="ml-3 flex justify-center px-4 py-4"
              >
                Save & Close
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
