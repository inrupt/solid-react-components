import React, { useState, useContext } from 'react';
import { InputTextTypes, UI, RDF } from '@constants';
import { ThemeContext } from '@context';
import { InputGroup } from '../Input/input.styles';

export const Decimal = props => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const {
    [RDF.TYPE]: type,
    [UI.LABEL]: label,
    [UI.MAX_LENGTH]: maxLength,
    [UI.MIN_VALUE]: minValue,
    [UI.SIZE]: size,
    [UI.VALUE]: initialValue
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
