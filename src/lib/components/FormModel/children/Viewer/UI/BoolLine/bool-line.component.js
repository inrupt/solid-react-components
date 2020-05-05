import React, { useContext } from 'react';
import { UI } from '@inrupt/lit-generated-vocab-common';
import { ThemeContext } from '@context';

type Props = {
  id: string,
  data: object
};

export const BoolLine = (props: Props) => {
  const { id, data } = props;
  const { theme } = useContext(ThemeContext);

  const { [UI.value.value]: value, [UI.label.value]: label } = data;

  return (
    <div className={theme.boolField}>
      <label htmlFor={id}>{label}</label>
      <input
        {...{
          id,
          type: 'checkbox',
          defaultValue: value === 'true',
          checked: value === 'true',
          readOnly: true
        }}
      />
    </div>
  );
};
