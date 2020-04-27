import React, { useContext, useState } from 'react';
import { InputTextTypes } from '@constants';
import { ThemeContext } from '@context';
import { InputGroup } from '../Input/input.styles';
import { RDF, UI } from '@pmcb55/lit-generated-vocab-common-rdfext';

type Props = {
  id: string,
  data: object,
  updateData: (string, string) => void
};

export const Float = (props: Props) => {
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

  const onChange = event => setValue(event.target.value);

  const onBlur = () => {
    const updatedPart = { ...data, value };
    updateData(id, updatedPart);
  };

  return (
    <InputGroup className={theme.floatField}>
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
