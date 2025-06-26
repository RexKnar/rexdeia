'use client';

import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useUnassignClassInchargeMutationQuery } from 'lib/queries/staff/useUnassignClassInchargeFromSubjectMutationQuery';
import { CircleMinus, Loader2 } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, Text } from 'ui';

export function UnassignInchargeFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionId = searchParams.get('sectionId');
  const params = useParams<{ classId: string }>();
  const classId = params.classId || searchParams.get('classId');
  const { data: session } = useSession();
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  const isOpen = searchParams.get('isUnassignInchargeFlyoutOpen') === 'true';
  const academicYearId =
    searchParams.get('academicYearId') || session?.currentBatch;

  const { isPending, mutateAsync: unassignClassInchargeAsync } =
    useUnassignClassInchargeMutationQuery(classId, academicYearId, sectionId);

  const { data: sectionsResponse } = useGetAllSectionByClassIdQuery(
    { classId: params.classId, filter: {} },
    {
      enabled: !!params.classId,
    }
  );

  const currentSection = sectionsResponse?.data?.find(
    (section) => section.id === sectionId
  );
  const staffIncharges = currentSection?.staffIncharges || [];

  const { handleSubmit } = useForm();

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('isUnassignInchargeFlyoutOpen');
    params.delete('sectionId');
    params.delete('academicYearId');
    router.replace(pathname + '?' + params.toString());
  };

  async function onSubmit() {
    if (selectedStaffIds.length === 0) return;
    try {
      await Promise.all(
        selectedStaffIds.map((staffId) =>
          unassignClassInchargeAsync({ staffId })
        )
      );
      setSelectedStaffIds([]);
      closeFlyout();
    } catch (error) {
      console.error(' Error unassigning:', error);
    }
  }

  const toggleStaffSelection = (id: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Sheet open={isOpen}>
      <SheetContent
        side="right"
        widthSize="sm"
        className="w-72 bg-white px-4 py-6 md:w-[28rem] lg:w-[32rem]"
        onCloseClick={closeFlyout}
      >
        <SheetHeader>
          <SheetTitle className="mb-5">
            <div className="flex items-center">
              <CircleMinus size={20} strokeWidth={1.5} />
              <Text variant="lg-semibold" className="ml-2">
                Unassign Class Incharge
              </Text>
            </div>
          </SheetTitle>
          <hr className="border-t border-gray-300" />
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {staffIncharges.length > 0 ? (
            <>
              {staffIncharges.map((staff) => (
                <div
                  key={staff.id}
                  className="mt-2 flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id={`incharge-${staff.id}`}
                    checked={selectedStaffIds.includes(staff.id)}
                    onChange={() => toggleStaffSelection(staff.id)}
                  />
                  <label
                    htmlFor={`incharge-${staff.id}`}
                    className="cursor-pointer"
                  >
                    {staff.firstName} {staff.middleName} {staff.lastName}
                  </label>
                </div>
              ))}

              <Button
                type="submit"
                size="lg"
                variant="default"
                className="mx-auto mt-8 flex justify-center px-12 py-4"
                disabled={isPending || selectedStaffIds.length === 0}
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                    Removing
                  </div>
                ) : (
                  `Remove ${selectedStaffIds.length > 0 ? `(${selectedStaffIds.length})` : ''} Incharge${selectedStaffIds.length > 1 ? 's' : ''}`
                )}
              </Button>
            </>
          ) : (
            <div className="mt-4 text-center text-gray-500">
              No class incharges found for this section.
            </div>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
