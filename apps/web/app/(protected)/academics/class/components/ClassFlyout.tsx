import { PlusCircle } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
  Switch,
  Input,
  Text,
} from 'ui';

function AddClassFlyout() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors: fieldErrors },
  } = useForm();
  const isLinkActive = useWatch({ name: 'isActive', control });

  async function addClass(payload) {
    try {
      console.log(payload);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <section>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="default">Add Class</Button>
          </SheetTrigger>
          <SheetContent side="right" widthSize="sm" className="bg-white p-10">
            <form onSubmit={handleSubmit(addClass)}>
              <SheetHeader>
                <SheetTitle className="mb-5">
                  <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                    <div className="flex items-center">
                      <PlusCircle size={20} strokeWidth={1.5} />
                      <Text variant="lg-semibold" className="ml-2">
                        Add Class
                      </Text>
                    </div>
                    <div className=" items-center">
                      <Switch
                        {...register('isActive')}
                        id="isActive"
                        value={isLinkActive ? 'true' : 'false'}
                        onCheckedChange={() => {
                          setValue('isActive', !isLinkActive);
                        }}
                      />
                      <label
                        htmlFor="isActive"
                        className="ml-2 text-sm font-semibold"
                      >
                        {isLinkActive ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </div>
                </SheetTitle>
                <hr className="border-t border-gray-300"></hr>
              </SheetHeader>

              <div className="mt-5">
                <div>
                  <label
                    htmlFor="classTitle"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Class Name
                  </label>
                  <Input
                    {...register('classTitle', {
                      required: 'Class Name is Required',
                    })}
                    className="border-primary-200 p-1"
                    id="classTitle"
                  />
                  <p
                    className={`h-2 p-1 text-center text-sm text-red-600 ${
                      fieldErrors.classTitle
                        ? 'opacity-100 transition-opacity duration-300'
                        : 'opacity-0 transition-opacity duration-300'
                    }`}
                  >
                    {fieldErrors.classTitle?.message as string}
                  </p>
                </div>

                <div className="mt-10">
                  <Button
                    size="lg"
                    variant="default"
                    className="mx-auto flex justify-center px-12 py-4"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </section>
    </>
  );
}

export { AddClassFlyout };
