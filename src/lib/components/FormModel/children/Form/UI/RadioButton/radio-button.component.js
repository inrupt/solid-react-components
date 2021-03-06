import React, { useContext, useState } from 'react';
import { ThemeContext } from '@context';
import { UI } from '@inrupt/lit-generated-vocab-common';

type Props = {
  id: string,
  data: object,
  updateData: (string, string) => void
};

export const RadioButton = (props: Props) => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const { [UI.label]: label, [UI.value]: initialValue } = data;

  const [value, setValue] = useState(initialValue);

  const onChange = event => setValue(event.target.value);

  const onBlur = () => {
    const updatedPart = { ...data, value };
    updateData(id, updatedPart);
  };

  return (
    <div className={theme.triStateField}>
      <label htmlFor={id}>{label}</label>
      <input
        {...{
          id,
          type: 'radio',
          value,
          onChange,
          onBlur
        }}
      />
    </div>
  );
};
