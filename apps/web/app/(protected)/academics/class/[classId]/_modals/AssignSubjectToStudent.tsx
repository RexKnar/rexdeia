'use client';
import { useGetStudentListByClassIdQuery } from 'lib/queries/students/useGetStudentListByClassIdQuery';
import { PlusCircle, Trash } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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

export function AssignSubjectToStudentFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isAssignSubjectToStudentFlyout') === 'true';
  // const subjectId = searchParams.get('subjectId');
  const subjectName = searchParams.get('subjectName');
  const params = useParams<{ classId: string }>();
  const { data: studentListResponse } = useGetStudentListByClassIdQuery(
    params.classId,
    {
      enabled: !!params.classId,
    }
  );
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({});

  const { reset } = useForm();

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('isAssignSubjectToStudentFlyout', 'false');
    params.delete('sectionId');
    reset();
    router.replace(pathname + '?' + params.toString());
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections' as never,
  });
  useEffect(() => {
    if (isOpen && fields.length === 0) {
      append({ sections: 'sections' });
    }
  }, [isOpen, fields, append]);

  async function AssignStudentToSubject(payload) {
    payload;
  }
  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="p-10 bg-white"
          onCloseClick={() => closeFlyout()}
        >
          <div className="max-h-[80vh] overflow-y-auto">
            
            <form onSubmit={handleSubmit(AssignStudentToSubject)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      Assign Subject To Student
                    </Text>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300"></hr>
              </SheetHeader>
              <Text variant="base-semibold" className="ml-2">
                {subjectName}
              </Text>
              {fields.map((row, index) => (
                <section key={row.id} className="flex align-middle">
                  <Select
                    autoComplete="off"
                    value={watch(`sections.${index}.StudentId`)}
                    {...register(`sections.${index}.StudentId` as any, {
                      required: 'student is required',
                    })}
                    onValueChange={(value) =>
                      setValue(`sections.${index}.StudentId` as any, value)
                    }
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {studentListResponse?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.firstName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p>
                    {errors[`sections.${index}.staffId`]?.message.toString()}
                  </p>
                  {fields.length > 1 ? (
                    <div className="m-2">
                      <Button
                        className="px-2 bg-red-600 border-transparent"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        <Trash size={20} className="text-center text-white" />
                      </Button>
                    </div>
                  ) : null}
                </section>
              ))}
              <div className="m-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex justify-center px-4 py-2 mx-auto"
                  onClick={() => {
                    append({ section: 'section' });
                  }}
                >
                  <Text variant="sm-bold" className="text-center text-primary">
                    Add New
                  </Text>
                </Button>
              </div>
              <div className="m-2">
                <Button
                  size="default"
                  variant="default"
                  className="flex justify-center px-12 py-4 mx-auto"
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
