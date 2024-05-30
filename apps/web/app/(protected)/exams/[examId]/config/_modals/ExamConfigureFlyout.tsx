'use client';

import { useCreateExamConfigQuery } from 'lib/queries/exams/configuration/useCreateExamConfigQuery';
import { useGetAssessmentFormatBySubjectIdQuery } from 'lib/queries/exams/subject/useGetAssessmentFormatBySubjectIdQuery';
import { PlusCircle } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Switch,
  Text,
} from 'ui';

export function ExamConfigureFlyout(props) {
  const { classId, sectionId, subjects, examSubjectPartition } = props;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  const examId = useParams<{ examId: string }>().examId;

  const keysToDelete = [
    'markToConduct',
    'markToConvert',
    'minPassMark',
    'dateToConduct',
  ];
  const isOpen = searchParams.get('isExamConfigureFlyoutOpen') === 'true';
  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm();

  const [subjectTotalMarks, setsubjectTotalMarks] = useState();
  const [subjectMarksToConvert, setSubjectMarksToConvert] = useState();

  const handleTotalMarks = (e) => {
    setsubjectTotalMarks(e.target.value);
  };
  const marksToConvert = (f) => {
    setSubjectMarksToConvert(f.target.value);
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'configDetail',
  });

  const toggleForm = (assessmentFormat) => {
    const index = fields.findIndex(
      (field) => field['assessmentFormatId'] === assessmentFormat.id
    );
    if (index > -1) {
      remove(index);
    } else {
      append({
        assessmentFormatId: assessmentFormat.id,
        name: assessmentFormat.name,
      });
    }
  };

  const { data: assessmentFormatResponse } =
    useGetAssessmentFormatBySubjectIdQuery(subjectId, {
      enabled: !!subjectId,
    });

  const { mutateAsync: mutateCreateExamConfigurationAsync } =
    useCreateExamConfigQuery(examId);

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isExamConfigureFlyoutOpen', 'false');
    fields.splice(0, fields.length);
    router.replace(pathname + '?' + params.toString());
    reset();
  };
  async function saveExamConfigure(payload) {
    keysToDelete.forEach((key) => delete payload[key]);

    payload.subjects = subjects;
    payload.classId = classId;
    payload.examId = examId;
    payload.subjectTotalMarks = subjectTotalMarks;
    payload.subjectMarksToConvert = subjectMarksToConvert;
    payload.sectionIds = [sectionId];
    const createdExamConfiguration =
      await mutateCreateExamConfigurationAsync(payload);

    if (createdExamConfiguration) {
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
                      <Text variant="lg-semibold" className="ml-2">
                        Exam Configuration of
                        {subjects.map((subject) => {
                          return <span key={subject.id}>{subject.name} </span>;
                        })}
                      </Text>
                    </div>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300"></hr>
              </SheetHeader>
              <div className="flex gap-3">
                <div className="mt-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Total Marks to Conduct
                  </label>
                  <Input
                    onChange={handleTotalMarks}
                    autoFocus
                    type="text"
                    className="mt-2"
                    placeholder="Marks to conduct"
                  />
                </div>
                <div className="mt-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Marks to Convert
                  </label>
                  <Input
                    onChange={marksToConvert}
                    autoFocus
                    type="text"
                    className="mt-2"
                    placeholder="Marks to Convert"
                  />
                </div>
              </div>
              {subjectTotalMarks && subjectMarksToConvert && (
                <div className="mt-5 flex flex-wrap">
                  {assessmentFormatResponse?.map((assessmentFormat, index) => {
                    const subjectConfigIndex =
                      examSubjectPartition?.findIndex(
                        (obj) =>
                          obj?.assessmentFormat?.id == assessmentFormat?.id
                      ) ?? -1;
                    if (subjectConfigIndex < 0)
                      return (
                        <div className="w-1/2" key={assessmentFormat.id}>
                          <Switch
                            id={`configDetail.${index}.${assessmentFormat.name}`}
                            key={index}
                            checked={assessmentFormat[index]}
                            onCheckedChange={() => {
                              toggleForm(assessmentFormat);
                            }}
                          />
                          <label
                            htmlFor={assessmentFormat.name}
                            className="ml-2 text-sm font-semibold"
                          >
                            {assessmentFormat.name}
                          </label>
                        </div>
                      );
                  })}
                </div>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="mt-5 p-1">
                  <div>
                    <label htmlFor="name" className="text-sm font-semibold">
                      {field['name']}
                    </label>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="dateToConduct"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Date to Conduct
                    </label>
                    <Input
                      type={'date'}
                      {...register(`configDetail.${index}.dateToConduct`, {
                        required: 'date to Conduct is Required',
                      })}
                    />
                  </div>
                  <div className="mt-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Marks to conduct
                    </label>
                    <Input
                      {...register(`configDetail.${index}.totalMarks`, {
                        required: 'Mark to Conduct is Required',
                      })}
                      id={`configDetail.${index}.markToConduct`}
                      key={index}
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
                      {...register(`configDetail.${index}.convertTo`, {
                        required: 'Convert Mark to is Required',
                      })}
                      id={`configDetail.${index}.markToConvert`}
                      key={index}
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
                      {...register(`configDetail.${index}.minMark`, {
                        required: 'Min Pass Mark is Required',
                      })}
                      id={`configDetail.${index}.minPassMark`}
                      key={index}
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
              ))}
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
