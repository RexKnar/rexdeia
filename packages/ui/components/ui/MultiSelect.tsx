import React from 'react';

import Select from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/stateManager';

export default function MultiSelect(props: StateManagerProps) {
  const colourOptions = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];
  return (
    <Select
      isMulti
      name="colors"
      options={colourOptions}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
}
