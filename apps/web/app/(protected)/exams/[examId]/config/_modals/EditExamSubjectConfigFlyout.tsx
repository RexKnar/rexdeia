'use client';
import { useGetExamSubjectConfigDetailByIdQuery } from 'lib/queries/exams/configuration/subject/useGetExamSubjectConfigDetailByIdQuery';
import { useUpdateExamSubjectQuery } from 'lib/queries/exams/configuration/subject/useUpdateExamSubjectMutationQuery';
import { PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from 'ui';

export function EditExamSubjectConfigFlyout(props) {
  const { subjects, sectionIds } = props;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const examSubjectId = searchParams.get('examSubjectId');
  const subjectId = searchParams.get('subjectId');
  const examId = searchParams.get('examId');

  const isOpen = searchParams.get('isEditSubjectConfigFlyoutOpen') === 'true';
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm();

  const { data: examSubjectConfigDetailResponse } =
    useGetExamSubjectConfigDetailByIdQuery(examSubjectId, {
      enabled: !!examSubjectId,
    });
  const { mutateAsync: mutateUpdateExamSubjectAsync } =
    useUpdateExamSubjectQuery(examSubjectId, examId, sectionIds, subjectId);
  useEffect(() => {
    if (examSubjectConfigDetailResponse) {
      const { minMark, convertTo, totalMarks } =
        examSubjectConfigDetailResponse;

      const partitionValues = {
        minMark: minMark,
        convertTo: convertTo,
        totalMarks: totalMarks,
      };
      reset(partitionValues);
    }
  }, [examSubjectConfigDetailResponse]);

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isEditSubjectConfigFlyoutOpen', 'false');
    router.replace(pathname + '?' + params.toString());
    reset();
  };
  async function saveExamConfigure(payload) {
    const { minMark, convertTo, totalMarks } = payload;

    const partitionValues = {
      minMark: +minMark,
      convertTo: +convertTo,
      totalMarks: +totalMarks,
    };
    const updateExamSubject =
      await mutateUpdateExamSubjectAsync(partitionValues);
    if (updateExamSubject) {
      closeFlyout();
    }
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
                      Exam Subject Configuration of
                      {subjects.map((subject) => {
                        return (
                          <Text variant="lg-semibold" key={subject.id}>
                            {subject.name}{' '}
                          </Text>
                        );
                      })}
                    </div>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300"></hr>
              </SheetHeader>

              <div className="mt-5 p-1">
                <div className="mt-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Marks to conduct
                  </label>
                  <Input
                    {...register(`totalMarks`, {
                      required: 'Mark to Conduct is Required',
                    })}
                    id={`markToConduct`}
                    autoFocus
                    type="text"
                    className="mt-2"
                    placeholder="Marks to conduct"
                    errorMessage={fieldErrors?.markToConduct?.message.toString()}
                  />
                </div>
                <div className="mt-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Mark to Convert
                  </label>
                  <Input
                    {...register(`convertTo`, {
                      required: 'Convert Mark to is Required',
                    })}
                    id={`markToConvert`}
                    type="text"
                    className="mt-2"
                    placeholder="Mark to Convert"
                    errorMessage={fieldErrors?.markToConvert?.message.toString()}
                  />
                </div>
                <div className="mt-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Min Pass Mark
                  </label>
                  <Input
                    {...register(`minMark`, {
                      required: 'Min Pass Mark is Required',
                    })}
                    id={`minPassMark`}
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
