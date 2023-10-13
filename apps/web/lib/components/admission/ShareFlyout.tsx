'use client';

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'ui';

export function ShareFlyout() {
  
  return (
    <> 
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="bg-blue-500 text-white mt-3 border-2">Open Modal</Button>
          </SheetTrigger>
          <SheetContent side="right" widthSize="sm" className="bg-white">
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <div className="py-4">Hello World!</div>
            </div>
          </SheetContent>
        </Sheet>
    </>
  );
}
