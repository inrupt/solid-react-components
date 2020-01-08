import React, { useContext, useState } from 'react';

import { ThemeContext } from '@context';

import { UI, RDF, InputTextTypes } from '@constants';

export const Input = props => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const {
    [UI.LABEL]: label,
    [UI.MAXLENGTH]: maxLength,
    [RDF.TYPE]: type,
    [UI.VALUE]: initialValue
  } = data;

  const [value, setValue] = useState(initialValue);

  const onChange = event => {
    setValue(event.target.value);
  };

  const onBlur = () => {
    updateData(id, value);
  };

  return (
    <div className={theme && theme.inputText}>
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
    </div>
  );
};
