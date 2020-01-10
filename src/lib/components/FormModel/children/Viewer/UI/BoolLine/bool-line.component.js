import React, { useContext } from 'react';
import { ThemeContext } from '@context';

import { UI } from '@constants';

type Props = {
  id: string,
  data: object
};

export const BoolLine = (props: Props) => {
  const { id, data } = props;
  const { theme } = useContext(ThemeContext);

  const { [UI.VALUE]: value, [UI.LABEL]: label } = data;

  return (
    <div className={theme.boolField}>
      <label htmlFor={id}>{label}</label>
      <input
        {...{
          type: 'checkbox',
          defaultValue: value === 'true',
          checked: value === 'true',
          readOnly: true
        }}
      />
    </div>
  );
};
