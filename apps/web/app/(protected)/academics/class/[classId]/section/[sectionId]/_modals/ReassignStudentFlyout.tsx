import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useReassignStudentMuttionQuery } from 'lib/queries/class/useReassignStudentMuttionQuery';
import { useGetGroupListQuery } from 'lib/queries/group/useGetGroupListQuery';
import { useGetMediumListQuery } from 'lib/queries/medium/useGetMediumListQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { ChevronDown, PlusCircle } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
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

export function ReassignStudentFlyout() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = { isActive: true };
  const isOpen = searchParams.get('isReassignStudentFlyoutOpen') === 'true';
  const studentId = searchParams.get('studentId');
  const page = 1;
  const limit = 999;
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm();
  const { classId } = useParams<{ classId: string }>();

  const { data: classListResponse } = useGetClassListQuery({
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
  useEffect(() => {
    if (classId) setValue('classId', classId);
  }, [classId, setValue]);

  const { data: groupListResponse } = useGetGroupListQuery({
    page,
    limit,
    filter,
  });

  const { data: mediumListResponse } = useGetMediumListQuery({
    page,
    limit,
    filter,
  });

  const {
    isPending: isPendingSwitchStudent,
    mutateAsync: mutateSwitchStudentAsync,
  } = useReassignStudentMuttionQuery();

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isReassignStudentFlyoutOpen', 'false');
    params.delete('sectionId');

    router.replace(pathname + '?' + params.toString());
  };

  async function reAssignStudent(payload) {
    try {
      payload['academicYear'] = session.currentBatch;
      payload['studentId'] = studentId;
      const response = await mutateSwitchStudentAsync(payload);
      if (response) {
        closeFlyout();
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Sheet open={isOpen}>
      <SheetContent
        side="right"
        widthSize="sm"
        className="bg-white p-10"
        onCloseClick={() => closeFlyout()}
      >
        <SheetHeader>
          <SheetTitle>
            <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
              <div className="flex items-center">
                <PlusCircle size={20} strokeWidth={1.5} />

                <Text variant="lg-semibold" className="ml-2">
                  Re-Assign Students
                </Text>
              </div>
            </div>
          </SheetTitle>
          <hr className="border-t border-gray-300"></hr>
        </SheetHeader>
        <section>
          <form onSubmit={handleSubmit(reAssignStudent)}>
            <div className="mt-4">
              <label
                htmlFor="type"
                className="text-sm font-semibold text-gray-700"
              >
                Choose Class
              </label>
              <Select
                autoComplete="off"
                {...register('classId', {
                  required: 'Class is required',
                })}
                value={watch('classId')}
                onValueChange={(value) => {
                  if (value) {
                    setValue('classId', value);
                  }
                }}
              >
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {classListResponse?.data?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldErrors['classId'] && (
                <p className="h-2 p-1 text-sm text-red-600">
                  {fieldErrors['classId'].message as string}
                </p>
              )}
            </div>
            <div className="mt-4">
              <label
                htmlFor="sectionName"
                className="text-sm font-semibold text-gray-700"
              >
                Choose Section
              </label>
              <Select
                autoComplete="off"
                {...register('sectionId', {
                  required: ' Section is Requeired',
                })}
                value={watch('sectionId')}
                onValueChange={(value) => {
                  if (value) {
                    setValue('sectionId', value);
                  }
                }}
              >
                <SelectTrigger className="ml-4 basis-1/2">
                  <SelectValue
                    className="text-gray-400"
                    placeholder="Section"
                  />
                  <ChevronDown className="text-gray-400" />
                </SelectTrigger>
                <SelectContent className="border border-primary-200">
                  <SelectGroup>
                    {sectionListResponse?.data?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>

                {fieldErrors.sectionId && (
                  <p className="ml-4 text-red-500">
                    {fieldErrors.sectionId.message.toString()}
                  </p>
                )}
              </Select>
            </div>
            <div className="mt-4">
              <label
                htmlFor="group"
                className="text-sm font-semibold text-gray-700"
              >
                Choose Group
              </label>
              <Select
                autoComplete="off"
                {...register('groupId', {
                  required: 'Group is  Requeired',
                })}
                value={watch('groupId')}
                onValueChange={(value) => {
                  if (value) {
                    setValue('groupId', value);
                  }
                }}
              >
                <SelectTrigger className=" basis-1/2">
                  <SelectValue className="text-gray-400" placeholder="Group" />{' '}
                  <ChevronDown className="text-gray-400" />
                </SelectTrigger>
                <SelectContent className="border border-primary-200">
                  <SelectGroup>
                    {groupListResponse?.data?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
                {fieldErrors.groupId && (
                  <p className="text-red-500">
                    {fieldErrors.groupId.message.toString()}
                  </p>
                )}
              </Select>
            </div>
            <div className="mt-4">
              <label
                htmlFor="group"
                className="text-sm font-semibold text-gray-700"
              >
                Choose Medium
              </label>
              <Select
                autoComplete="off"
                {...register('mediumId', {
                  required: 'Medium is  Requeired',
                })}
                value={watch('mediumId')}
                onValueChange={(value) => {
                  if (value) {
                    setValue('mediumId', value);
                  }
                }}
              >
                <SelectTrigger className=" basis-1/2">
                  <SelectValue className="text-gray-400" placeholder="Medium" />{' '}
                  <ChevronDown className="text-gray-400" />
                </SelectTrigger>
                <SelectContent className="border border-primary-200">
                  <SelectGroup>
                    {mediumListResponse?.data?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
                {fieldErrors.mediumId && (
                  <p className="text-red-500">
                    {fieldErrors.mediumId.message.toString()}
                  </p>
                )}
              </Select>
            </div>
            <div className="mt-10 flex justify-center ">
              <Button
                size="default"
                variant="default"
                type="submit"
                disabled={isPendingSwitchStudent}
                className="ml-3 flex justify-center px-4 py-4"
              >
                Change
              </Button>
            </div>
          </form>
        </section>
      </SheetContent>
    </Sheet>
  );
}
