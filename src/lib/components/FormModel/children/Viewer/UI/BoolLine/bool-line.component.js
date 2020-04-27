import React, { useContext } from 'react';
import { ThemeContext } from '@context';

import { UI } from '@pmcb55/lit-generated-vocab-common-rdfext';

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
