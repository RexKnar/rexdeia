import { useArchiveStudentMutationById } from 'lib/queries/students/useArchiveStudentMutationQuery';
import { PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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

export function ArchiveStudentFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isArchiveStudentFlyoutOpen') === 'true';
  const studentId = searchParams.get('studentId');

  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm();

  const {
    isPending: isPendingArchiveStudent,
    mutateAsync: mutateArchiveStudentAsync,
  } = useArchiveStudentMutationById();

  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isArchiveStudentFlyoutOpen', 'false');
    params.delete('studentId');
    params.delete('isArchiveStudentFlyoutOpen');

    router.replace(pathname + '?' + params.toString());
  };

  async function archiveStudent(payload) {
    try {
      payload['studentId'] = studentId;
      const response = await mutateArchiveStudentAsync(payload);
      if (response) {
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
        className=" w-72 md:w-[28rem] lg:w-[32rem] px-4 py-6 bg-white"
        onCloseClick={() => closeFlyout()}
      >
        <SheetHeader>
          <SheetTitle>
            <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
              <div className="flex items-center">
                <PlusCircle size={20} strokeWidth={1.5} />

                <Text variant="lg-semibold" className="ml-2">
                  Re-Assign Students
                </Text>
              </div>
            </div>
          </SheetTitle>
          <hr className="border-t border-gray-300"></hr>
        </SheetHeader>
        <section>
          <form onSubmit={handleSubmit(archiveStudent)}>
            <div className="mt-4">
              <label
                htmlFor="type"
                className="text-sm font-semibold text-gray-700"
              >
                Remark
              </label>
              <Input type="text" {...register('remark')} />
              {fieldErrors['remark'] && (
                <p className="h-2 p-1 text-sm text-red-600">
                  {fieldErrors['remark'].message as string}
                </p>
              )}
            </div>
            <div className="flex justify-center mt-10 ">
              <Button
                size="default"
                variant="default"
                type="submit"
                disabled={isPendingArchiveStudent}
                className="flex justify-center px-4 py-4 ml-3"
              >
                Change
              </Button>
            </div>
          </form>
        </section>
      </SheetContent>
    </Sheet>
  );
}
