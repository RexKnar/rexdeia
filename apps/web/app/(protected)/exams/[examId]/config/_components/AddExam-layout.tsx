'use client';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamConfigSubjectDetailQuery } from 'lib/queries/exams/configuration/subject/useGetExamConfigSubjectDetailQuery';
import { useDeleteExamSubjectConfigMutationQuery } from 'lib/queries/exams/configuration/useDeleteExamConfigMutationQuery';
import { useGetExamDetailQuery } from 'lib/queries/exams/useGetExamDetailQuery';
import { useGetExamListQuery } from 'lib/queries/exams/useGetExamListQuery';
import { useGetSubjectsBySectionIdsMutationQuery } from 'lib/queries/section/subjects/useGetSubjectsBySectionIdsQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useGetSubjectTypeList } from 'lib/queries/subject-type/useGetSubjectTypeQuery';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from 'ui';

import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

import { AssessmentFormatDetailCard } from './Assessment-Format-Detail-Card';
import { ExamConfigSectionCard } from './ExamConfigSectionCard';
import { ExamConfigSubjectCard } from './ExamConfigSubjectCard';
import { ExamConfigurationNameCard } from './ExamConfigurationNameCard';

export function AddExamLayout() {
  const ExamConfigureFlyout = dynamic(() =>
    import('../_modals/ExamConfigureFlyout').then(
      (mod) => mod.ExamConfigureFlyout
    )
  );
  const EditExamPartitionFlyout = dynamic(() =>
    import('../_modals/EditExamPartitionFlyout').then(
      (mod) => mod.EditExamPartitionFlyout
    )
  );
  const page = 1;
  const limit = 999;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);
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
  const { toast } = useToast();
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjectIds, setSubjectIds] = useState([]);
  const [subjectTypeId, setSubjectTypeId] = useState('');
  const [subjectTypeList, setSubjectTypeList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [examSubjectPartition, setExamSubjectPartition] = useState([]);
  const [openFlyout, setOpenFlyout] = useState(false);
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
    refetch: refetchSubjectConfigList,
  } = useGetExamConfigSubjectDetailQuery(
    { examId, sectionId, subjectId },
    {
      enabled: !!subjectId && !!sectionId,
    }
  );

  useEffect(() => {
    if (subjectId) {
      subjectConfigListResponse?.examSubjectPartition?.length
        ? setOpenFlyout(false)
        : setOpenFlyout(true);
    }
  }, [subjectConfigListResponse, subjectId]);

  useEffect(() => {
    if (subjectId) {
      params.set('subjectId', subjectId);
    }
    params.set('isExamConfigureFlyoutOpen', openFlyout ? 'true' : 'false');
    router.replace(pathname + '?' + params.toString());
  }, [openFlyout, subjectId]);

  const { data: subjectTypeListResponse, isLoading: isSubjectTypeListLoading } =
    useGetSubjectTypeList({
      page,
      limit,
      filter,
    });

  useEffect(() => {
    if (subjectTypeListResponse?.data) {
      setSubjectTypeList(subjectTypeListResponse?.data || []);
    }
  }, [subjectTypeListResponse]);

  const {
    data: subjectListResponse,
    isLoading: isSubjectListLoading,
    refetch: refetchSubjectList,
  } = useGetSubjectsBySectionIdsMutationQuery(
    [sectionId],
    subjectTypeId,
    classId,
    {
      enabled: !!sectionId && !!subjectTypeId,
    }
  );

  const {
    isError: isConfigDeleteError,
    isSuccess: isConfigDeleteSuccess,
    mutateAsync: deleteExamSubjectConfigAsync,
  } = useDeleteExamSubjectConfigMutationQuery(examId, sectionId, subjectId);

  useEffect(() => {
    if (isConfigDeleteError) {
      toast({
        title: 'Error',
        variant: 'default',
        description: 'Error while deleting config',
      });
    }
  }, [isConfigDeleteError, toast]);

  useEffect(() => {
    if (isConfigDeleteSuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Config deleted successfully',
      });
      hideDeleteConfirmationModal();
    }
  }, [isConfigDeleteSuccess, toast]);

  useEffect(() => {
    if (subjectListResponse) {
      setSubjectList(subjectListResponse as any[]);
    }
  }, [subjectListResponse]);
  useEffect(() => {
    const subjectConfigResponse =
      subjectConfigListResponse?.examSubjectPartition || [];
    setExamSubjectPartition(subjectConfigResponse);
  }, [subjectConfigListResponse]);

  useEffect(() => {
    if (subjectId) {
      refetchSubjectConfigList();
    }
  }, [subjectId, refetchSubjectConfigList]);

  useEffect(() => {
    params.delete('subjectId');
    router.replace(pathname + '?' + params.toString());
    setSubjectId('');
  }, [sectionId, subjectTypeId, classId]);

  useEffect(() => {
    params.delete('subjectId');
    router.replace(pathname + '?' + params.toString());
    setSubjectId('');

    setSubjectList([]);
  }, [sectionId]);

  useEffect(() => {
    params.delete('subjectId');
    router.replace(pathname + '?' + params.toString());
    setSectionId('');
    setSubjectTypeId('');
    setSubjectId('');
    setSubjectList([]);
  }, [classId]);

  function hideDeleteConfirmationModal() {
    params.set('isDeleteConfigModal', 'false');
    params.delete('configId');
    router.replace(pathname + '?' + params.toString());
  }

  const handleSectionChange = (sectionId) => {
    setSectionId(sectionId);
  };

  const handleSubjectClick = (subjectDetail) => {
    setSubjectIds([subjectDetail] as any[]);
    setSubjectId(subjectDetail.subjectId);
    refetchSubjectConfigList();
  };
  const handleSubjectTypeClick = (subjectId) => {
    setSubjectTypeId(subjectId);
  };
  useEffect(() => {
    refetchSubjectList();
  }, [subjectTypeId]);
  const handleClassClick = (classId) => {
    setClassId(classId);
  };

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
                      currentValue={classId}
                      cardValue={cardData.id}
                      name={cardData.name}
                      key={cardData.id}
                      onClick={handleClassClick}
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
          <div>
            {classId ? (
              <div>
                {!isSectionListLoading ? (
                  <div>
                    {sectionListResponse?.data?.map((cardData) => (
                      <ExamConfigSectionCard
                        key={cardData.id}
                        sectionId={cardData.id}
                        name={cardData.name}
                        currentSectionId={sectionId}
                        onClick={handleSectionChange}
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
            ) : (
              <div className="flex justify-center pt-36">
                <p className="text-black ">No Data Found</p>
              </div>
            )}
          </div>
        </div>
        <div className="basis-2/6 bg-blue-50 text-center">
          <div className="p-2">Subject Type</div>
          <div>
            {sectionId ? (
              <div>
                {!isSubjectTypeListLoading ? (
                  <div>
                    {subjectTypeList.map((cardData) => (
                      <ExamConfigurationNameCard
                        currentValue={subjectTypeId}
                        cardValue={cardData.id}
                        name={cardData.name}
                        key={cardData.id}
                        onClick={() => {
                          handleSubjectTypeClick(cardData.id);
                        }}
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
            ) : (
              <div className="flex justify-center pt-36">
                <p className="text-black ">No Data Found</p>
              </div>
            )}
          </div>
        </div>
        <div className="basis-2/6 bg-slate-200 text-center">
          <div className="p-2">Subject</div>
          <div>
            <div>
              {subjectList.length > 0 ? (
                subjectList.map((groupData) => {
                  return (
                    <div
                      key={groupData.id}
                      className="border-1 border border-gray-50"
                    >
                      <h4 className="bg-red-100">{groupData.name}</h4>
                      {groupData.subject.map((cardData) => {
                        return (
                          <ExamConfigSubjectCard
                            currentSubjectId={subjectId}
                            key={cardData.id}
                            subjectId={cardData.id}
                            groupId={groupData.id}
                            name={cardData.name}
                            onClick={handleSubjectClick}
                          />
                        );
                      })}
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center pt-36">
                  <p className="text-black ">No Data Found</p>
                </div>
              )}
            </div>
            {isSubjectListLoading && (
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
                {examSubjectPartition?.map((cardData) => {
                  return cardData.assessmentFormat ? (
                    <AssessmentFormatDetailCard {...cardData} />
                  ) : null;
                })}
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
      <ExamConfigureFlyout
        sectionId={sectionId}
        subjects={subjectIds}
        classId={classId}
        examSubjectPartition={examSubjectPartition || []}
      />
      <EditExamPartitionFlyout
        sectionId={sectionId}
        subjects={subjectIds}
        classId={classId}
      />
      <DeleteConfirmationModal
        open={showDeleteConfirmationModal}
        description={`Are you sure you want to delete the record?`}
        onDeleteClick={async () => {
          if (configId) {
            await deleteExamSubjectConfigAsync(configId);
          }
        }}
        onCancelClick={() => {
          hideDeleteConfirmationModal();
        }}
      />
    </>
  );
}
