'use client';

import { useGetSubjectMasterListQuery } from 'lib/queries/subject-master/useGetAllSubjectMasterQuery';
import { useGetSubjectByIdQuery } from 'lib/queries/subjects/useGetSubjectByIdQuery';
import { useUpdateSubjectMutationQuery } from 'lib/queries/subjects/useUpdateSubjectMutationQuery';
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
  Switch,
  Text,
} from 'ui';

import { CreateSubjectModel } from '../../../../../../lib/domain/subject';
import { useGetAssessmentFormatList } from '../../../../../../lib/queries/assessment-format/useGetAssessmentFormatList';
import { useGetGroupListQuery } from '../../../../../../lib/queries/group/useGetGroupListQuery';
import { useGetRegulationListQuery } from '../../../../../../lib/queries/regulations/useGetRegulationListQuery';
import { useGetSubjectTypeList } from '../../../../../../lib/queries/subject-type/useGetSubjectTypeQuery';
import { useCreateSubjectMutationByClassIdQuery } from '../../../../../../lib/queries/subjects/useCreateSubjectMutationByClassIdQuery';

export function AddSubjectFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get('isAddSubjectFlyoutOpen') === 'true';
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const filter = { isActive: true };
  const subjectId = searchParams.get('subjectId');
  const {
    control,
    watch,
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: null,
      isActive: false,
      assessmentFormatIds: [],
      groupIds: [],
      regulationId: null,
      subjectMasterId: null,
      subjectTypeId: null,
      elective: null,
    },
  });

  const { data: subjectDetails } = useGetSubjectByIdQuery(subjectId, {
    enabled: !!subjectId,
  });

  useEffect(() => {
    if (subjectDetails) {
      const initialValues = {
        isActive: subjectDetails.isActive,
        name: subjectDetails.name,
        regulationId: subjectDetails.regulationId,
        subjectMasterId: subjectDetails.subjectMasterId,
        elective: subjectDetails.elective?.toString(),
        groupIds: subjectDetails.subjectToGroup.map((group) => group.groupId),
        assessmentFormatIds: subjectDetails.subjectToAssessmentFormat.map(
          (assessmentFormat) => assessmentFormat.assessmentFormatId
        ),
        subjectTypeId: subjectDetails.subjectToSubjectTypes.map(
          (subjecttype) => subjecttype.subjectTypeId
        ),
      };
      reset(initialValues);
    }
  }, [subjectDetails]);

  const {
    isPending: isPendingCreateSubject,
    mutateAsync: mutateCreateSubjectsAsync,
  } = useCreateSubjectMutationByClassIdQuery();

  const {
    isPending: isPendingUpdateSubject,
    mutateAsync: mutateUpdateSubjectAsync,
  } = useUpdateSubjectMutationQuery();

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
    filter: { isActive: true },
  });

  const { classId } = useParams<{ classId: string }>();

  const { data: regulationListResponse } = useGetRegulationListQuery({
    page,
    limit,
    filter,
  });

  const { data: subjectMasterList } = useGetSubjectMasterListQuery({
    page,
    limit,
    filter,
  });

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('isAddSubjectFlyoutOpen', 'false');
    params.delete('subjectId');
    router.replace(pathname + '?' + params.toString());
  };

  const saveSubject = async (payload: CreateSubjectModel) => {
    try {
      if (subjectId) {
        const requestPayload = {
          ...payload,
          elective: payload.elective,
          id: subjectId,
          classId: classId,
        };

        await mutateUpdateSubjectAsync(requestPayload);
      } else {
        const addSubjectRequestPayload = {
          ...payload,
          elective: payload.elective,
        };

        const requestPayload = {
          subjects: [
            {
              ...addSubjectRequestPayload,
            },
          ],
          classId: classId,
        };

        await mutateCreateSubjectsAsync(requestPayload);
      }
    } finally {
      reset();
      closeFlyout();
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
          <form onSubmit={handleSubmit(saveSubject)}>
            <SheetHeader>
              <SheetTitle className="mb-5">
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      {subjectId ? 'Update subject' : 'New Subject'}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      id="isActive"
                      {...register('isActive')}
                      onCheckedChange={(value) => setValue('isActive', value)}
                      checked={watch('isActive')}
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 text-sm font-semibold"
                    >
                      {watch('isActive') ? 'Active' : 'Inactive'}
                    </label>
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
                    {...register('name', {
                      required: 'Name is required',
                    })}
                    id="name"
                    autoFocus
                    type="text"
                    className="mt-2"
                    placeholder="Enter Subject Name"
                    errorMessage={fieldErrors?.name?.message.toString()}
                  />
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
                  {...register('regulationId', {
                    required: 'Regulation is required',
                  })}
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
                {fieldErrors['regulationId'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {fieldErrors['regulationId'].message as string}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <label
                  htmlFor="master"
                  className="text-sm font-semibold text-gray-700"
                >
                  Subject Master
                </label>
                <Select
                  autoComplete="off"
                  {...register('subjectMasterId', {
                    required: 'Subject master is required',
                  })}
                  value={watch('subjectMasterId')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('subjectMasterId', value);
                    }
                  }}
                >
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {subjectMasterList?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldErrors['subjectMasterId'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {fieldErrors['subjectMasterId'].message as string}
                  </p>
                )}
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
                  {...register('subjectTypeId', {
                    required: 'Subject type is required',
                  })}
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
                {fieldErrors['subjectTypeId'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {fieldErrors['subjectTypeId'].message as string}
                  </p>
                )}
              </div>
              <div className="py-4">
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-gray-700"
                >
                  Assessment Format
                </label>
                <div className="mt-2 flex flex-wrap">
                  {assessmentFormatList?.data?.map((item) => (
                    <Controller
                      key={item.id}
                      control={control}
                      name="assessmentFormatIds"
                      rules={{ required: ' Select at least 1 option' }}
                      render={({ field }) => {
                        const isChecked = field.value.includes(item.id);
                        return (
                          <label className="me-5">
                            <Checkbox
                              className="me-2 items-center space-x-2 rounded border border-primary-500"
                              checked={isChecked}
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
                {fieldErrors['assessmentFormatIds'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {fieldErrors['assessmentFormatIds'].message as string}
                  </p>
                )}
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
                      rules={{ required: ' Select at least 1 option' }}
                      render={({ field }) => {
                        const isChecked = field.value.includes(item.id);
                        return (
                          <label className="me-5">
                            <Checkbox
                              className="me-2 items-center space-x-2 rounded border border-primary-500"
                              checked={isChecked}
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
                {fieldErrors['groupIds'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {fieldErrors['groupIds'].message as string}
                  </p>
                )}
              </div>
              <div className="mt-7">
                <Controller
                  name="elective"
                  control={control}
                  rules={{ required: 'Please select an option' }}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <div className="flex">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" />
                          <label
                            htmlFor="Elective"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Elective
                          </label>
                        </div>
                        <div className="ml-5 flex items-center space-x-2">
                          <RadioGroupItem value="2" />
                          <label
                            htmlFor="Non-Elective"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Non-Elective
                          </label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                />

                {fieldErrors['elective'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {fieldErrors['elective']?.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-10 flex justify-center ">
              <Button
                size="default"
                variant="default"
                type="submit"
                disabled={isPendingCreateSubject || isPendingUpdateSubject}
                className="ml-3 flex justify-center px-4 py-4"
              >
                {subjectId ? 'Update' : 'Save'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
