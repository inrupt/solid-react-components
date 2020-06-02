import React, { useContext } from 'react';
import { UI } from '@inrupt/lit-generated-vocab-common';
import { ThemeContext } from '@context';

type Props = {
  id: string,
  data: object
};

export const SingleLine = (props: Props) => {
  const { id, data } = props;
  const { theme } = useContext(ThemeContext);

  const { [UI.label]: label, [UI.value]: value } = data;

  return (
    <div className={theme.singleLine}>
      <label htmlFor={id} className={theme.singleLineLabel}>
        {label}
      </label>
      <div id={id} className={theme.singleLineValue}>
        {value}
      </div>
    </div>
  );
};
