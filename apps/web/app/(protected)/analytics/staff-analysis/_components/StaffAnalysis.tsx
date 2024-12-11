'use client';

import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamsBySectionIdQuery } from 'lib/queries/exams/useGetExamBySectionIdQuery';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'ui';

import StaffAnalysisTable from './StaffAnalysisTable';

export function StaffAnalysis() {
  const page = 1;
  const limit = 999;
  const filter = {};

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const classId = searchParams.get('classId');
  const examId = searchParams.get('examId');

  const { data: examList } = useGetExamsBySectionIdQuery(
    { classId },
    {
      enabled: !!classId,
    }
  );

  const { data: classList } = useGetClassListQuery({
    page,
    limit,
    filter,
  });

  return (
    <>
      <section className="space-y-2 rounded-md bg-white p-6">
        <div className="flex gap-4">
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Class</label>
            <Select
              autoComplete="off"
              value={classId}
              onValueChange={(value) => {
                params.set('classId', value);

                router.replace(pathname + '?' + params.toString());
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {classList?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Exam</label>
            <Select
              autoComplete="off"
              value={examId ?? 'all'}
              onValueChange={(value) => {
                params.set('examId', value);

                router.replace(pathname + '?' + params.toString());
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Choose a Exam</SelectItem>
                  {examList?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
      <Tabs defaultValue="sectionAnalytics" className="border-0 ">
        <TabsList className="w-full justify-start border-b-2 border-gray-100">
          <TabsTrigger
            value="sectionAnalytics"
            className="mr-2 text-base focus:border-b-4 focus:border-primary print:hidden"
          >
            Staff-Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent className="w-full" value="sectionAnalytics">
          <section>
            <StaffAnalysisTable />
          </section>
        </TabsContent>
      </Tabs>
    </>
  );
}
