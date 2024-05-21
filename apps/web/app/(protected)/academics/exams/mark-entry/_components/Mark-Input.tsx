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
      if (inputValue > validationData.markToConduct) {
        setErrorMessage(`${inputValue}> ${validationData.markToConduct}`);
      } else {
        const status = inputValue >= validationData.minPassMark ? 'P' : 'F';
        setErrorMessage('');
        setMarkStatus(status);
      }
    } else {
      setMarkStatus('-');
    }
  }, [currentMark]);

  return (
    <div className="justify-center flex-1">
      <div className="flex w-full">
        <div className="flex h-10 text-center">
          <When condition={markStatus == 'F'}>
            <CircleDot className="w-4 h-full text-red-500 transition-opacity duration-500" />
          </When>
          <When condition={markStatus == 'P'}>
            <Check className="w-4 h-full text-green-500 transition-opacity duration-500" />
          </When>
          <When condition={markStatus == '-'}>
            <CircleDot className="w-4 h-full text-gray-500 transition-opacity duration-500" />
          </When>
        </div>
        <div className="me-2">
          <Input
            type="number"
            maxLength={validationData.markToConduct}
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
                  className="items-center space-x-2 border rounded me-1 border-primary-500"
                  checked={currentAttendance}
                  onCheckedChange={(checked) => {
                    field.onChange(checked ? 1 : 0);
                  }}
                />

                <label className="text-red-500 item-center">A</label>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
