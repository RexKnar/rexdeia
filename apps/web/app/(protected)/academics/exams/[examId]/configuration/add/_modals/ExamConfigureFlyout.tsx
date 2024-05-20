'use client';

import { useGetAssessmentFormatBySubjectIdQuery } from 'lib/queries/exams/subject/useGetAssessmentFormatBySubjectIdQuery';
import { useGetSubjectExamDetailQuery } from 'lib/queries/exams/subject/useGetSubjectExamConfigQuery';
import { useCreateExamConfigurationQuery } from 'lib/queries/exams/useCreateExamConfigurationMutationQuery';
import { PlusCircle } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
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

export function ExamConfigureFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');
  const classId = searchParams.get('classId');
  const examId = useParams<{ examId: string }>().examId;
  const sectionId = searchParams.get('sectionId');
  const subjectTypeId = searchParams.get('subjectTypeId');
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assessmentFormatConfiguration',
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

  const { data: subjectConfigListResponse } = useGetSubjectExamDetailQuery(
    { examId, sectionId, subjectId },
    {
      enabled: !!subjectId,
    }
  );

  const { mutateAsync: mutateCreateExamConfigurationAsync } =
    useCreateExamConfigurationQuery(examId);

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isExamConfigureFlyoutOpen', 'false');
    fields.splice(0, fields.length);
    router.replace(pathname + '?' + params.toString());
    reset();
  };

  async function saveExamConfigure(payload) {
    const additionalValues = {
      markToConduct: payload.markToConduct,
      dateToConduct: new Date(payload.dateToConduct),
      markToConvert: payload.markToConvert,
      minPassMark: payload.minPassMark,
      assessmentFormatId: null,
    };
    keysToDelete.forEach((key) => delete payload[key]);

    payload.assessmentFormatConfiguration.push(additionalValues);
    payload.subjectId = subjectId;
    payload.classId = classId;
    payload.sectionId = sectionId;
    payload.subjectTypeId = subjectTypeId;
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
                        Exam Configuration
                      </Text>
                    </div>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300"></hr>
              </SheetHeader>
              <div className="mt-5 flex flex-wrap">
                {assessmentFormatResponse?.map((assessmentFormat, index) => {
                  const subjectConfigIndex =
                    subjectConfigListResponse?.examConfiguration.findIndex(
                      (obj) => obj?.assessmentFormat?.id == assessmentFormat?.id
                    ) ?? -1;
                  if (subjectConfigIndex < 0)
                    return (
                      <div className="w-1/2" key={assessmentFormat.id}>
                        <Switch
                          id={`assessmentFormatConfiguration.${index}.${assessmentFormat.name}`}
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
                      {...register(
                        `assessmentFormatConfiguration.${index}.dateToConduct`,
                        {
                          required: 'date to Conduct is Required',
                        }
                      )}
                    />
                  </div>
                  <div className="mt-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Marks to conduct
                    </label>
                    <Input
                      {...register(
                        `assessmentFormatConfiguration.${index}.markToConduct`,
                        {
                          required: 'Mark to Conduct is Required',
                        }
                      )}
                      id={`assessmentFormatConfiguration.${index}.markToConduct`}
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
                      {...register(
                        `assessmentFormatConfiguration.${index}.markToConvert`,
                        {
                          required: 'Convert Mark to is Required',
                        }
                      )}
                      id={`assessmentFormatConfiguration.${index}.markToConvert`}
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
                      {...register(
                        `assessmentFormatConfiguration.${index}.minPassMark`,
                        {
                          required: 'Min Pass Mark is Required',
                        }
                      )}
                      id={`assessmentFormatConfiguration.${index}.minPassMark`}
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
