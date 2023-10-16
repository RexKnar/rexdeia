'use client';

import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Button,
  Calendar,
  Flyout,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from 'ui';
import { cn } from 'utils';

export function ShareFlyout() {
  const [date, setDate] = useState<Date>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Flyout isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center">
          <h2 className="border bg-slate-400 p-2 text-white">
            Testing HTML Content
          </h2>
          <h1>Hello</h1>
          <div className="flex items-center space-x-2">
            <Switch id="test" />
            <label htmlFor="test">Toggle Switch</label>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[240px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Pick a date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </Flyout>
      <Button className="mt-6 text-white" onClick={openModal}>
        Open Modal
      </Button>
    </>
  );
}
