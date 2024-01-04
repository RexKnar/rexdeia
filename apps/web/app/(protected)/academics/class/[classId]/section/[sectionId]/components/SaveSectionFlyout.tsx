'use client';

import { PlusCircle } from 'lucide-react';
import { parseAsBoolean, useQueryState } from 'next-usequerystate';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Switch,
  Text,
} from 'ui';

function SaveSectionFlyout() {
  const [isOpen, setIsOpen] = useQueryState(
    'isSectionFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );
  const closeFlyout = async () => {
    await setIsOpen(false);
  };

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeFlyout()}
        >
          <form>
            <SheetHeader>
              <SheetTitle>
                <div className="sm:grid sm:grid-cols-1 sm:gap-4 md:grid md:grid-cols-1 md:gap-4 lg:flex lg:justify-between">
                  <div className="flex items-center">
                    <PlusCircle size={20} strokeWidth={1.5} />
                    <Text variant="lg-semibold" className="ml-2">
                      New Section
                    </Text>
                  </div>
                  <div>
                    <Switch />
                    <label
                      htmlFor="isActive"
                      className="ml-2 text-sm font-semibold"
                    >
                      Active
                    </label>
                  </div>
                </div>
              </SheetTitle>
              <hr className="border-t border-gray-300"></hr>
            </SheetHeader>

            <div className="mt-5">
              <div>
                <label
                  htmlFor="regulationName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Section Name
                </label>
                <Input className="mt-2" />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="regulationName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Medium
                </label>
                <Input className="mt-2" placeholder="English" />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="regulationName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Department
                </label>
                <Input className="mt-2" placeholder="Science" />
              </div>

              <div className="mt-10 flex">
                <Button
                  size="lg"
                  variant="default"
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  Save
                </Button>
                <Button
                  size="lg"
                  variant="default"
                  className="mx-auto flex justify-center px-12 py-4"
                >
                  Save & close
                </Button>
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}

export default SaveSectionFlyout;
