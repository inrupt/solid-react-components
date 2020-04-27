import React, { useContext } from 'react';
import { ThemeContext } from '@context';

import { UI } from '@pmcb55/lit-generated-vocab-common-rdfext';

type Props = {
  id: string,
  data: object
};

export const SingleLine = (props: Props) => {
  const { id, data } = props;
  const { theme } = useContext(ThemeContext);

  const { [UI.label.value]: label, [UI.value.value]: value } = data;

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
