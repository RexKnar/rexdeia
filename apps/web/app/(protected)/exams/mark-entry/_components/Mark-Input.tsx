'use client';

import { Check, CircleDot } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { When } from 'react-if';
import { Checkbox, Input } from 'ui';

export function MarkInput({
  control,
  registerKey,
  fieldName,
  validationData,
  attendance,
}) {
  const [markStatus, setMarkStatus] = useState('-');
  const [errorMessage, setErrorMessage] = useState('');

  const currentMark = useWatch({
    control,
    name: `${registerKey}.mark`,
    defaultValue: '',
  });
  const currentAttendance = useWatch({
    control,
    name: `${registerKey}.attendance`,
    defaultValue: attendance ?? 0,
  });
  useEffect(() => {
    const inputValue = parseFloat(currentMark);
    const isValidNumber = !isNaN(inputValue);

    if (isValidNumber) {
      if (inputValue > validationData?.totalMarks) {
        setErrorMessage(`${inputValue}> ${validationData?.totalMarks}`);
      } else {
        const status = inputValue >= validationData?.minMark ? 'P' : 'F';
        setErrorMessage('');
        setMarkStatus(status);
      }
    } else {
      setMarkStatus('-');
    }
  }, [currentMark, validationData?.minMark, validationData?.totalMarks]);

  return (
    <div className="flex-1 justify-center">
      <div className="flex w-full">
        <div className="flex h-10 text-center">
          <When condition={markStatus == 'F'}>
            <CircleDot className="h-full w-4 text-red-500 transition-opacity duration-500" />
          </When>
          <When condition={markStatus == 'P'}>
            <Check className="h-full w-4 text-green-500 transition-opacity duration-500" />
          </When>
          <When condition={markStatus == '-'}>
            <CircleDot className="h-full w-4 text-gray-500 transition-opacity duration-500" />
          </When>
        </div>
        <div className="me-2">
          <Input
            type="string"
            className="w-2/3 lg:w-[200px]"
            maxLength={validationData?.totalMarks}
            placeholder={fieldName}
            errorMessage={errorMessage}
            {...control.register(`${registerKey}.mark`)}
          />
        </div>
        <div className="flex items-center gap-1">
          <Controller
            control={control}
            name={`${registerKey}.attendance`}
            render={({ field }) => (
              <>
                <Checkbox
                  className="me-1 items-center space-x-2 rounded border border-primary-500"
                  checked={currentAttendance}
                  onCheckedChange={(checked) => {
                    field.onChange(checked ? 1 : 0);
                  }}
                />

                <label className="item-center text-red-500">A</label>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
