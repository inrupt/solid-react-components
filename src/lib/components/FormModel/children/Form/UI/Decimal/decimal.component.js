import React, { useState, useContext } from 'react';
import { InputTextTypes } from '@constants';
import { ThemeContext } from '@context';
import { InputGroup } from '../Input/input.styles';
import { RDF, UI } from '@inrupt/lit-generated-vocab-common';

export const Decimal = props => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const {
    [RDF.type.value]: type,
    [UI.label.value]: label,
    [UI.maxLength.value]: maxLength,
    [UI.minValue.value]: minValue,
    [UI.size.value]: size,
    [UI.value.value]: initialValue
  } = data;

  const [value, setValue] = useState(initialValue);

  const onChange = event => {
    setValue(event.target.value);
  };

  const onBlur = () => {
    const updatedPart = { ...data, value };
    updateData(id, updatedPart);
  };

  return (
    <InputGroup className={theme.decimalInput}>
      <label htmlFor={id}>{label}</label>
      <input
        {...{
          id,
          type: InputTextTypes[type],
          min: minValue,
          maxLength,
          size,
          value,
          onChange,
          onBlur
        }}
      />
    </InputGroup>
  );
};
