'use client';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useDeleteExamSubjectConfigMutationQuery } from 'lib/queries/exams/configuration/useDeleteExamConfigMutationQuery';
import { useGetSubjectExamDetailQuery } from 'lib/queries/exams/subject/useGetSubjectExamConfigQuery';
import { useGetExamDetailQuery } from 'lib/queries/exams/useGetExamDetailQuery';
import { useGetExamListQuery } from 'lib/queries/exams/useGetExamListQuery';
import { useGetSubjectListByFilter } from 'lib/queries/exams/useGetSubjectByFilterQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useGetSubjectTypeList } from 'lib/queries/subject-type/useGetSubjectTypeQuery';
import { Loader2 } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect } from 'react';
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';

import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

import { AssessmentFormatDetailCard } from './Assessment-Format-Detail-Card';
import { ExamConfigurationNameCard } from './ExamConfigurationNameCard';

export function AddExamLayout() {
  const page = 1;
  const limit = 999;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const classId = searchParams.get('classId');

  const sectionId = searchParams.get('sectionId');
  const subjectTypeId = searchParams.get('subjectTypeId');
  const subjectId = searchParams.get('subjectId');
  const configId = searchParams.get('configId');
  const showDeleteConfirmationModal =
    searchParams.get('isDeleteConfigModal') === 'true';

  const filter = { isActive: true };
  const routeParams = useParams<{ examId: string }>();
  const examId = searchParams.get('examId') || routeParams.examId;
  const { data: examsList } = useGetExamListQuery({
    page,
    limit,
  });

  const { data: examDetail, isLoading: isExamDetailLoading } =
    useGetExamDetailQuery(
      { examId: routeParams.examId || examId },
      {
        enabled: !!examId || !!routeParams.examId,
      }
    );
  const { data: classList, isLoading: isClassListLoading } =
    useGetClassListQuery({
      page,
      limit,
      filter,
    });
  const { data: sectionListResponse, isLoading: isSectionListLoading } =
    useGetAllSectionByClassIdQuery(
      { classId, filter },
      {
        enabled: !!classId,
      }
    );

  const {
    data: subjectConfigListResponse,
    isLoading: isSubjectConfigListLoading,
  } = useGetSubjectExamDetailQuery(
    { examId, sectionId, subjectId },
    {
      enabled: !!subjectId,
    }
  );

  const { data: subjectTypeListResponse, isLoading: isSubjectTypeListLoading } =
    useGetSubjectTypeList({
      page,
      limit,
      filter,
    });
  const {
    data: getSubjectByFilterResponse,
    isPending: isSubjectListLoading,
    mutateAsync: mutateGetSubjectAsync,
  } = useGetSubjectListByFilter();
  const { mutateAsync: deleteExamSubjectConfigAsync } =
    useDeleteExamSubjectConfigMutationQuery(examId, sectionId, subjectId);

  useEffect(() => {
    if (subjectTypeId) {
      const payload = {
        subjectTypeId: subjectTypeId,
        sectionId: sectionId,
        classId: classId,
      };
      mutateGetSubjectAsync(payload).catch((error) => {
        console.error(error);
      });
    }
  }, [subjectTypeId, sectionId, classId, mutateGetSubjectAsync]);

  function hideDeleteConfirmationModal() {
    const params = new URLSearchParams(searchParams);
    params.set('isDeleteConfigModal', 'false');
    params.delete('configId');
    router.replace(pathname + '?' + params.toString());
  }
  return (
    <>
      <section className="mb-4 flex flex-row gap-5 rounded-md bg-white p-4">
        <div className=" basis-1/4">
          <label
            htmlFor="Term"
            className="pr-2 text-sm font-semibold text-gray-700"
          >
            Exam Name :
          </label>
          {routeParams && (
            <text>{isExamDetailLoading ? 'Loading...' : examDetail?.name}</text>
          )}

          {!routeParams && (
            <Select
              onValueChange={(value) => {
                if (value) {
                  const params = new URLSearchParams(searchParams);
                  params.set('examId', value);
                  router.replace(pathname + '?' + params.toString());
                }
              }}
              disabled={!!routeParams}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {examsList?.data?.map((exam) => (
                    <SelectItem
                      key={exam.id}
                      defaultChecked={exam.id === examId ? true : false}
                      value={exam.id}
                    >
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="basis-1/4">
          <label
            htmlFor="Term"
            className="pr-2 text-sm font-semibold text-gray-700"
          >
            Term :
          </label>
          {routeParams.examId && (
            <text>
              {isExamDetailLoading ? 'Loading...' : examDetail?.term.name}
            </text>
          )}
        </div>
      </section>
      <section className="flex h-screen flex-row gap-1 rounded-xl bg-white p-1">
        <div className="basis-1/6 rounded-l-lg bg-gray-50 text-center">
          <div className="p-2">Class</div>
          <div>
            <div>
              {!isClassListLoading ? (
                <div className="">
                  {classList?.data.map((cardData) => (
                    <ExamConfigurationNameCard
                      type="classId"
                      queryValue={cardData.id}
                      name={cardData.name}
                      openFlyout={false}
                      key={cardData.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center pt-36 ">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
                  <p className="text-black ">Fetching Classes...</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="basis-1/6 bg-red-50 text-center">
          <div className="p-2">Section</div>
          {!isSectionListLoading ? (
            <div>
              {sectionListResponse?.data?.map((cardData) => (
                <ExamConfigurationNameCard
                  type="sectionId"
                  queryValue={cardData.id}
                  name={cardData.name}
                  openFlyout={false}
                  key={cardData.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center pt-36">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
              <p className="text-black ">Fetching Sections...</p>
            </div>
          )}
        </div>
        <div className="basis-2/6 bg-blue-50 text-center">
          <div className="p-2">Subject Type</div>
          <div>
            {sectionId ? (
              <div>
                {!isSubjectTypeListLoading ? (
                  <div>
                    {subjectTypeListResponse?.data.map((cardData) => (
                      <ExamConfigurationNameCard
                        type="subjectTypeId"
                        queryValue={cardData.id}
                        name={cardData.name}
                        openFlyout={false}
                        key={cardData.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center pt-36">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
                    <p className="text-black ">Fetching Sections...</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div className="basis-2/6 bg-slate-200 text-center">
          <div className="p-2">Subject</div>
          <div>
            {!isSubjectListLoading ? (
              <div>
                {getSubjectByFilterResponse?.data.map((cardData) => (
                  <ExamConfigurationNameCard
                    type="subjectId"
                    queryValue={cardData.id}
                    name={cardData.name}
                    key={cardData.id}
                    openFlyout={
                      subjectConfigListResponse?.examConfiguration.length
                        ? false
                        : true
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center pt-36">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
                <p className="text-black ">Fetching Subjects...</p>
              </div>
            )}
          </div>
        </div>
        <div className="basis-2/6 bg-slate-200 px-1 text-center">
          <div className="p-2">Config Details</div>
          <div>
            {!isSubjectConfigListLoading ? (
              <div>
                {subjectConfigListResponse?.examConfiguration.map(
                  (cardData) => {
                    return cardData.assessmentFormat ? (
                      <AssessmentFormatDetailCard {...cardData} />
                    ) : null;
                  }
                )}
              </div>
            ) : (
              <div className="flex justify-center pt-36">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
                <p className="text-black ">Fetching Details...</p>
              </div>
            )}
            <div className="flex justify-center py-3 ">
              <Button
                className=" text-primary"
                variant="outline"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('isExamConfigureFlyoutOpen', 'true');
                  router.replace(pathname + '?' + params.toString());
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </section>
      <DeleteConfirmationModal
        open={showDeleteConfirmationModal}
        description={`Are you sure you want to delete the record?`}
        onDeleteClick={async () => {
          if (configId) {
            await deleteExamSubjectConfigAsync(configId);
            hideDeleteConfirmationModal();
          }
        }}
        onCancelClick={() => {
          hideDeleteConfirmationModal();
        }}
      />
    </>
  );
}
