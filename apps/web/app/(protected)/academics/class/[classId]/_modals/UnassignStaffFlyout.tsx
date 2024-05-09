'use client';

import { CircleMinus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from 'ui';

export function UnassignStaffFlyout() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: 'sectionandsubjects',
  });

  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const staffId = searchParams.get('staffId');
  const staffName = searchParams.get('staffName');
  // const academicYearId = searchParams.get('academicYearId');
  const router = useRouter();
  const isOpen = searchParams.get('isUnassignStaffFlyoutOpen') === 'true';
  const staffSubjectList = [
    {
      sectionid: 1,
      sectionname: 'SectionA',
      subjects: [
        { id: 1, name: 'Tamil' },
        { id: 2, name: 'English' },
      ],
    },
    {
      sectionid: 2,
      sectionname: 'SectionB',
      subjects: [
        { id: 1, name: 'Tamil' },
        { id: 2, name: 'English' },
      ],
    },
  ];

  useEffect(() => {
    if (isOpen && staffSubjectList) {
      staffSubjectList.forEach((section) => {
        append({ sections: section.sectionid });
      });
    }
  }, []);

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isUnassignStaffFlyoutOpen', 'false');
    router.replace(pathname + '?' + params.toString());
  };

  const onsubmit = (data) => {
    console.log(data, errors);
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
          <SheetHeader>
            <SheetTitle className="mb-5">
              <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                <div className="flex items-center">
                  <CircleMinus size={20} strokeWidth={1.5} />
                  <Text variant="lg-semibold" className="ml-2">
                    Unassign Staff
                  </Text>
                </div>
              </div>
            </SheetTitle>
            <hr className="border-t border-gray-300"></hr>
          </SheetHeader>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div className="mt-6">
              <div>
                <Text variant="base-bold" className="text-gray-700">
                  {staffName}
                </Text>
              </div>
              {fields.map((section, index) => {
                return (
                  <div className="mt-2" key={index}>
                    <label
                      htmlFor="subjectName"
                      className="text-sm font-semibold text-gray-700"
                    >
                      {/* {staffSubjectList[index]?.sectionname} */}
                    </label>
                    <div className="me-6 mt-2 flex flex-wrap items-center">
                      {staffSubjectList[index].subjects.map((subject) => {
                        return (
                          <>
                            <Checkbox
                              className="me-2 items-center space-x-2 rounded border border-primary-500"
                              value={subject.id}
                              {...control.register(
                                `sectionandsubjects.subjects`
                              )}
                            />
                            <label>{subject?.name}</label>
                          </>
                        );
                      })}
                    </div>
                    {/* <SubjectForUnassignStaff
                    nestIndex={index}
                    subjects={payload[index]?.subjects}
                    {...{ control, register }}
                  /> */}
                  </div>
                );
              })}
            </div>
            <Button
              type="submit"
              size="lg"
              variant="default"
              className="mx-auto mt-8 flex justify-center px-12 py-4"
            >
              Remove
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
