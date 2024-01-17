'use client';

import { CalendarIcon } from 'lucide-react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function DateSelector(props: ReactDatePickerProps) {
  return (
    <div className="mt-2 flex w-full justify-between rounded-md border border-primary-200 p-2">
      <DatePicker
        {...props}
        className="w-40 outline-none hover:border-none"
        showIcon
        icon={<CalendarIcon className="flex justify-end text-primary-500" />}
      />
    </div>
  );
}
