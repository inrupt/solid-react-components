import React, { useState, useContext } from 'react';
import { InputTextTypes, UI, RDF } from '@constants';
import { ThemeContext } from '@context';

type Props = {
  id: string,
  data: object,
  updateData: (string, string) => void
};

export const Phone = (props: Props) => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const {
    [RDF.TYPE]: type,
    [UI.LABEL]: label,
    [UI.MAX_LENGTH]: maxLength,
    [UI.SIZE]: size,
    [UI.PATTERN]: pattern,
    [UI.VALUE]: initialValue
  } = data;

  const [value, setValue] = useState(initialValue);

  const onChange = event => setValue(event.target.value);

  const onBlur = () => updateData(id, value);

  return (
    <div className={theme.phoneField}>
      <label htmlFor={id}>{label}</label>
      <input
        {...{
          id,
          type: InputTextTypes[type],
          pattern,
          maxLength,
          size,
          value,
          onChange,
          onBlur
        }}
      />
    </div>
  );
};
