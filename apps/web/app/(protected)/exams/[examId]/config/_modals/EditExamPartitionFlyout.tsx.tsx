'use client';
import { useGetExamPartitionByIdIdQuery } from 'lib/queries/exams/configuration/useGetExamPartitionByIdIdQuery';
import { useUpdateExamConfigQuery } from 'lib/queries/exams/configuration/useUpdateExamConfigMutationQuery';
import { PlusCircle } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
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

export function EditExamPartitionFlyout(props) {
  const { classId, sectionId, subjects, examSubjectPartition } = props;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const configId = searchParams.get('configId');

  const examId = useParams<{ examId: string }>().examId;

  const isOpen = searchParams.get('isExamPartitionFlyoutOpen') === 'true';
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm();

  const { data: examPartitionDetailResponse } = useGetExamPartitionByIdIdQuery(
    configId,
    {
      enabled: !!configId,
    }
  );

  const { mutateAsync: mutateUpdateExamConfigurationAsync } =
    useUpdateExamConfigQuery(examId);

  const closeFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isEditExamPartitionFlyoutOpen', 'false');
    router.replace(pathname + '?' + params.toString());
    reset();
  };
  async function saveExamConfigure(payload) {
    const createdExamConfiguration = await mutateUpdateExamConfigurationAsync({
      payload,
      classId,
      sectionId,
    });

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

              <div className="mt-5 p-1">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold">
                    Dummy
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
                    {...register(`dateToConduct`, {
                      required: 'date to Conduct is Required',
                    })}
                  />
                </div>
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
