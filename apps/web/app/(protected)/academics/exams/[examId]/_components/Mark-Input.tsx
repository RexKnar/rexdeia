'use client';

import { Check, CircleDot } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { When } from 'react-if';
import { Input } from 'ui';

export function MarkInput({ control, registerKey, fieldName, validationData }) {
  const [markStatus, setMarkStatus] = useState('-');
  const [errorMessage, setErrorMessage] = useState('');

  const currentMark = useWatch({
    control,
    name: `${registerKey}.mark`,
    defaultValue: '',
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
        <div>
          <Input
            type="number"
            maxLength={validationData.markToConduct}
            placeholder={fieldName}
            errorMessage={errorMessage}
            {...control.register(`${registerKey}.mark`)}
          />
        </div>
      </div>
    </div>
  );
}
