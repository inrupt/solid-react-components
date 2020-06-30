import React, { useState, useContext } from 'react';
import { RDF, UI } from '@solid/lit-vocab-common';
import { InputTextTypes } from '@constants';
import { ThemeContext } from '@context';
import { InputGroup } from '../Input/input.styles';

type Props = {
  id: string,
  data: object,
  updateData: (string, string) => void
};

export const Integer = (props: Props) => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const {
    [RDF.type]: type,
    [UI.label]: label,
    [UI.minValue]: minValue,
    [UI.size]: size,
    [UI.value]: initialValue
  } = data;

  const [value, setValue] = useState(initialValue);

  const onChange = event => {
    const re = /^[0-9]+$/;
    if (event.target.value === '' || re.test(event.target.value)) setValue(event.target.value);
  };

  const onBlur = () => {
    const updatedPart = { ...data, value };
    updateData(id, updatedPart);
  };

  return (
    <InputGroup className={theme && theme.integerField}>
      <label htmlFor={id}>{label}</label>
      <input
        {...{
          id,
          type: InputTextTypes[type],
          min: minValue,
          step: '1',
          size,
          value,
          onChange,
          onBlur
        }}
      />
    </InputGroup>
  );
};
