'use client';

import { useUnassignClassInchargeMutationQuery } from 'lib/queries/staff/useUnassignClassInchargeFromSubjectMutationQuery';
import { CircleMinus, Loader2 } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, Text } from 'ui';

export function UnassignInchargeFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ classId: string }>();
  const { data: session } = useSession();

  const isOpen = searchParams.get('isUnassignInchargeFlyoutOpen') === 'true';
  const staffId = searchParams.get('staffId');
  const academicYearId =
    searchParams.get('academicYearId') || session.currentBatch;

  const { isPending, mutateAsync: unassignClassInchargeAsync } =
    useUnassignClassInchargeMutationQuery(
      params.classId,
      staffId,
      academicYearId
    );

  const { handleSubmit } = useForm();

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('isUnassignInchargeFlyoutOpen');
    params.delete('staffId');
    params.delete('academicYearId');
    router.replace(pathname + '?' + params.toString());
  };

  async function onSubmit() {
    try {
      const res = await unassignClassInchargeAsync({});
      if (res) {
        closeFlyout();
      }
    } catch (error) {
      console.error(error);
    }
  }

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
          <p className="mt-6 text-black">
            Are you sure you want to remove this staff member as Class Incharge
            for this class?
          </p>
          <Button
            type="submit"
            size="lg"
            variant="default"
            className="mx-auto mt-8 flex justify-center px-12 py-4"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                Removing
              </div>
            ) : (
              'Remove Incharge'
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
