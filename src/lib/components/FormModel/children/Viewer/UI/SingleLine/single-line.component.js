import React, { useContext } from 'react';
import { ThemeContext } from '@context';

import { UI } from '@constants';

type Props = {
  id: string,
  data: object
};

export const SingleLine = (props: Props) => {
  const { id, data } = props;
  const { theme } = useContext(ThemeContext);

  const { [UI.LABEL]: label, [UI.VALUE]: value } = data;

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
