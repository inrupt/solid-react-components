import React, { useState, useContext } from 'react';
import { ThemeContext } from '@context';

import { UI } from '@constants';

type Props = {
  id: string,
  data: object,
  updateData: (string, string) => void
};

export const TextArea = (props: Props) => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const { [UI.LABEL]: label, [UI.MAX_LENGTH]: maxLength, [UI.VALUE]: initialValue } = data;

  const [value, setValue] = useState(initialValue);

  const onChange = event => setValue(event.target.value);

  const onBlur = () => {
    const updatedPart = { ...data, value };
    updateData(id, updatedPart);
  };

  return (
    <div className={theme.textArea}>
      <label htmlFor={id}>{label}</label>
      <textarea
        {...{
          id,
          value,
          onChange,
          onBlur
        }}
      />
    </div>
  );
};
