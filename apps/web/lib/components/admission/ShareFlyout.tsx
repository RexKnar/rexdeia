'use client';

import {
  Text,
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
} from 'ui';

export function ShareFlyout() {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="mt-3 border-2 bg-blue-500 text-white"
          >
            Open Modal
          </Button>
        </SheetTrigger>
        <SheetContent side="right" widthSize="lg" className="bg-white">
          <div className="p-3">
            <div className="flex justify-between items-center">
              <div>
                <img src="" alt="" className=""/>
                <Text variant="sm-semibold" className="">Share</Text>
              </div>
              <div>Inactive</div>
            </div>
          </div>
        </SheetContent>
        </Sheet>
    </>
  );
}
