import React, { useContext, useState } from 'react';
import { ThemeContext } from '@context';
import { UI } from '@pmcb55/lit-generated-vocab-common-rdfext';

type Props = {
  id: string,
  data: object,
  updateData: (string, string) => void
};

export const RadioButton = (props: Props) => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const { [UI.label.value]: label, [UI.value.value]: initialValue } = data;

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
