'use client';

import { CircleMinus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from 'ui';

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
export function UnassignStaffFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get('isUnassignStaffFlyoutOpen') === 'true';
  const [isSetStaffValue, setIsSetStaffValue] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors: fieldErrors },
  } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: 'sections',
  });

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isUnassignStaffFlyoutOpen', 'false');
    router.replace(pathname + '?' + params.toString());
  };

  const onsubmit = (data) => {
    console.log(data, fieldErrors);
  };

  useEffect(() => {
    if (isOpen && !isSetStaffValue) {
      staffSubjectList.forEach((section) => {
        append({
          sectionId: section.sectionid,
          sectionName: section.sectionname,
          subjects: [],
        });
      });
      setIsSetStaffValue(true);
    }
  }, [isOpen]);
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
                  Demo
                </Text>
              </div>
              {fields.length}
              {fields.map((section, index) => {
                return (
                  <div className="mt-2" key={index}>
                    <label
                      htmlFor="subjectName"
                      className="text-sm font-semibold text-gray-700"
                    ></label>
                    <div className="me-6 mt-2 flex flex-wrap items-center">
                      {staffSubjectList[index].subjects.map((subject) => {
                        return (
                          <Controller
                            key={subject.id}
                            control={control}
                            name={`sections.${index}.subjects`}
                            render={({ field }) => (
                              <>
                                <Checkbox
                                  className="me-2 items-center space-x-2 rounded border border-primary-500"
                                  checked={field.value.includes(subject.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([
                                        ...field.value,
                                        subject.id,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (id) => id !== subject.id
                                        )
                                      );
                                    }
                                  }}
                                >
                                  {subject.name}
                                </Checkbox>
                                <label className="me-5">
                                  <span>{subject.name}</span>
                                </label>
                              </>
                            )}
                          />
                        );
                      })}
                    </div>
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
