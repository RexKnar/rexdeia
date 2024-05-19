'use client';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';

import { ExamConfigurationNameCard } from './ExamConfigurationNameCard';

export function AddExamLayout() {
  const page = 1;
  const limit = 999;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const classId = searchParams.get('classId');
  const examId = searchParams.get('examId');
  const sectionId = searchParams.get('sectionId');
  const subjectTypeId = searchParams.get('subjectTypeId');
  const filter = { isActive: true };
  const routeParams = useParams<{ examId: string }>();

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

  const { data: subjectTypeListResponse, isLoading: isSubjectTypeListLoading } =
    useGetSubjectTypeList({
      page,
      limit,
      filter,
    });
  const {
    data: getSubjectByFilterResponse,
    isPending: isPendingSubjectListResponse,
    mutateAsync: mutateGetSubjectAsync,
  } = useGetSubjectListByFilter();

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
        <div className="basis-1/4 rounded-l-lg bg-gray-50 text-center">
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
        <div className="basis-1/4 bg-red-50 text-center">
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
        <div className="basis-1/4 bg-blue-50 text-center">
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
        <div className="basis-1/4 bg-slate-200 text-center">
          <div className="p-2">Subject</div>
          <div>
            {!isPendingSubjectListResponse ? (
              <div>
                {getSubjectByFilterResponse?.data.map((cardData) => (
                  <ExamConfigurationNameCard
                    type="subjectId"
                    queryValue={cardData.id}
                    name={cardData.name}
                    key={cardData.id}
                    openFlyout={true}
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
      </section>
    </>
  );
}
