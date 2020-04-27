import React, { useContext, useState } from 'react';
import { InputGroup } from './input.styles';
import { ThemeContext } from '@context';
import { InputTextTypes } from '@constants';
import { RDF, UI } from '@pmcb55/lit-generated-vocab-common-rdfext';

export const Input = props => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const {
    [UI.label.value]: label,
    [UI.maxLength.value]: maxLength,
    [RDF.type.value]: type,
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
    <InputGroup className={theme && theme.inputText}>
      <label htmlFor={id}>{label}</label>
      <input
        {...{
          id,
          type: InputTextTypes[type],
          value,
          maxLength,
          onChange,
          onBlur
        }}
      />
    </InputGroup>
  );
};
