'use client';

import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { useCopySectionMutationQuery } from 'lib/queries/section/copy/useCopySectionMutationQuery';
import { Loader2, PlusCircle } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from 'ui';

export function CopySectionFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = { isActive: true };
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState('');
  const isOpen = searchParams.get('isCopySectionFlyoutOpen') === 'true';
  const { classId: classIdFromParams } = useParams<{ classId: string }>();
  const classIdFromSearch = searchParams.get('classId');
  const classId = classIdFromSearch || classIdFromParams;
  const { data: session } = useSession();
  const academicYearId =
    searchParams.get('academicYearId') || session?.currentBatch;

  const { data: academicYearListResponse } = useGetBatchesListQuery({
    page: 1,
    limit: 999,
    filter,
  });
  const batchesList = academicYearListResponse?.data?.filter(
    (batch) => batch.id !== academicYearId
  );

  const { mutateAsync: mutateCopySection, isPending: isCopying } =
    useCopySectionMutationQuery();

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isCopySectionFlyoutOpen', 'false');
    params.delete('sectionId');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCopySubmit = async (e) => {
    e.preventDefault();
    if (!selectedAcademicYearId || !classId) return;

    try {
      await mutateCopySection({
        classId,
        academicYearId: selectedAcademicYearId,
      });
      closeFlyout();
      setSelectedAcademicYearId('');
    } catch (error) {
      console.error('Failed to copy sections:', error);
    }
  };

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="w-72 bg-white px-4 py-6 md:w-[28rem] lg:w-[32rem]"
          onCloseClick={closeFlyout}
        >
          <form onSubmit={handleCopySubmit}>
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center">
                  <PlusCircle size={20} strokeWidth={1.5} />
                  <Text variant="lg-semibold" className="ml-2">
                    Copy Sections
                  </Text>
                </div>
              </SheetTitle>
              <hr className="border-t border-gray-300" />
            </SheetHeader>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                Academic Year
              </label>
              <div className="mt-2 w-full">
                <Select
                  value={selectedAcademicYearId}
                  onValueChange={setSelectedAcademicYearId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {batchesList?.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-16">
              <Button
                size="lg"
                variant="default"
                disabled={!selectedAcademicYearId || isCopying}
                className="mx-auto flex justify-center px-12 py-4"
              >
                {isCopying ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                    Copying...
                  </div>
                ) : (
                  'Copy'
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
