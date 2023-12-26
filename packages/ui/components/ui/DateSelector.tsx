'use client';

import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
export function DateSelector(props: ReactDatePickerProps) {
  return <DatePicker {...props} />;
}
