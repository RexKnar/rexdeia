import { PlusCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
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
  Switch,
  Text,
} from 'ui';

export function SaveExamTypeFlyout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    setValue,
    watch,
    formState: { errors: fieldErrors },
  } = useForm({
    defaultValues: {
      name: null,
      isActive: false,
    },
  });

  const isOpen = searchParams.get('isMediumFlyoutOpen') === 'true';

  const closeMediumFlyout = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('isMediumFlyoutOpen', 'false');
    params.delete('mediumId');
    router.replace(pathname + '?' + params.toString());
  };
  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeMediumFlyout()}
        >
          <SheetHeader>
            <SheetTitle className="mb-5">
              <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid  lg:grid-cols-[1fr_100px]">
                <div className="flex items-center">
                  <PlusCircle size={20} strokeWidth={1.5} />
                  <Text variant="lg-semibold" className="ml-2">
                    {'Add Exam Type'}
                  </Text>
                </div>
                <div className="flex items-center">
                  <Switch
                    id="isActive"
                    {...register('isActive')}
                    onCheckedChange={(value) => setValue('isActive', value)}
                    checked={watch('isActive')}
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 text-sm font-semibold"
                  >
                    {watch('isActive') ? 'Active' : 'Inactive'}
                  </label>
                </div>
              </div>
            </SheetTitle>
            <hr className="border-t border-gray-300"></hr>
          </SheetHeader>
          <div className="mt-5">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Exam Type Name
              </label>
              <Input
                {...register('name', {
                  required: 'name is Required',
                })}
                autoFocus
                className="mt-2"
                id="name"
                errorMessage={fieldErrors?.name?.message.toString()}
              />
            </div>
          </div>
          <div className="mt-2">
            <label
              htmlFor="term"
              className="text-sm font-semibold text-gray-700"
            >
              Frequency
            </label>
            <div className="mt-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={'one'}>Value One</SelectItem>
                    <SelectItem value={'two'}>Value Two</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-10">
            <Button
              size="lg"
              variant="default"
              className="mx-auto flex justify-center px-12 py-4"
            >
              {'Save'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
