import React, { useContext, useState } from 'react';
import { ThemeContext } from '@context';
import { UI } from '@constants';

type Props = {
  id: string,
  data: object,
  updateData: (string, string) => void
};

export const RadioButton = (props: Props) => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const { [UI.LABEL]: label, [UI.VALUE]: initialValue } = data;

  const [value, setValue] = useState(initialValue);

  const onChange = event => setValue(event.target.value);

  const onBlur = () => updateData(id, value);

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
